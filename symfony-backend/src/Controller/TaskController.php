<?php

namespace App\Controller;

use App\Repository\TareaRepository;
use App\Service\TareaManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/tasks')]
class TaskController extends AbstractController
{
    public function __construct(
        private readonly TareaManager $tareaManager,            // lógica de negocio
        private readonly TareaRepository $tareaRepository,      // consultas directas
        private readonly EntityManagerInterface $entityManager  // referencias rápidas a entidades
    ) {
    }

    #[Route('', name: 'api_tasks_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $usuario = $this->getUser(); // en el ejercicio 04 estará autenticado
        $usuarioId = $usuario?->getId() ?? (int) $request->query->get('usuarioId', 1); // fallback temporal

        $filtros = [
            'estado' => $request->query->get('estado'),
            'texto' => $request->query->get('q'),
        ];

        $tareas = $this->tareaManager->listarPorUsuario($usuarioId, $filtros); // delega al servicio

        return $this->json($tareas);
    }

    #[Route('', name: 'api_tasks_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1)); // provisional

        
        // Sacamos el texto limpio que nos envía Postman
        $contenido = $request->getContent();
        
        // Intentamos traducirlo a JSON
        $payload = json_decode($contenido, true);

        // Si el cliente nos envió algo, pero json_decode devolvió null, significa que el formato está roto
        if ($contenido !== '' && $payload === null) {
            return $this->json(['error' => 'El formato JSON es inválido.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        

        $payload = $payload ?? [];


        $usuarioObj = $this->entityManager->getReference('App\Entity\Usuario', $usuarioId); // evita SELECT completo
        $tarea = $this->tareaManager->crear($payload, $usuarioObj); // utiliza el servicio para validar y guardar

        return $this->json($tarea, JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_tasks_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1));

        $tarea = $this->tareaManager->aseguraPerteneceAUsuario(
            $this->tareaRepository->find($id),
            $usuarioId
        );

        $payload = json_decode($request->getContent(), true) ?? [];
        $tarea = $this->tareaManager->actualizar($tarea, $payload); // actualiza campos permitidos

        return $this->json([
            'message' => 'Tarea actualizada correctamente',
        ]);
    }

    #[Route('/{id}/status', name: 'api_tasks_change_status', methods: ['PATCH'])]
    public function changeStatus(int $id, Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1));

        $tarea = $this->tareaManager->aseguraPerteneceAUsuario(
            $this->tareaRepository->find($id),
            $usuarioId
        );

        $payload = json_decode($request->getContent(), true) ?? [];
        $tarea = $this->tareaManager->cambiarEstado($tarea, $payload['estado'] ?? ''); // controla valores válidos

        return $this->json($tarea);
    }

    #[Route('/{id}', name: 'api_tasks_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1));

        $tarea = $this->tareaManager->aseguraPerteneceAUsuario(
            $this->tareaRepository->find($id),
            $usuarioId
        );

        $this->tareaManager->eliminar($tarea); // borra la tarea y responde 204

        return $this->json(['message' => 'Tarea eliminada correctamente']);
    }
}
