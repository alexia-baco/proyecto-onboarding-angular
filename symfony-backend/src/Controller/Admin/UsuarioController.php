<?php

namespace App\Controller\Admin;

use App\Repository\UsuarioRepository;
use App\Service\AdministradorUsuarioService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
//Importamos la clase IsGranted
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/users')]
// #[IsGranted('ROLE_ADMIN')] 

class UsuarioController extends AbstractController
{
    public function __construct(
        private readonly AdministradorUsuarioService $adminUsuarios, // capa de negocio
        private readonly UsuarioRepository $usuarioRepository        // acceso directo para finds
    ) {
    }

    #[Route('', name: 'api_admin_users_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $term = $request->query->get('q'); // parámetro opcional de búsqueda
        $usuarios = $this->adminUsuarios->listar($term); // reutiliza el servicio

        return $this->json($usuarios);
    }

    #[Route('', name: 'api_admin_users_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? []; // payload de creación
        $usuario = $this->adminUsuarios->crear($payload);          // valida, hashea y persiste

        return $this->json($usuario, JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}/reset-password', name: 'api_admin_users_reset_password', methods: ['POST'])]
    public function resetPassword(int $id): JsonResponse
    {
        $usuario = $this->usuarioRepository->find($id); // buscamos el usuario objetivo

        if (!$usuario) {
            return $this->json(['message' => 'Usuario no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        $passwordTemporal = $this->adminUsuarios->resetearPassword($usuario); // devuelve la contraseña temporal

        return $this->json([
            'message' => 'Password reseteada correctamente',
            'passwordTemporal' => $passwordTemporal,
        ]);
    }
}
