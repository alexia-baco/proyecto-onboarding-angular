<?php

namespace App\Controller;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\NotificacionUsuario;
use Psr\Log\LoggerInterface;

final class AuthController extends AbstractController
{
    public function __construct(
    private readonly UserPasswordHasherInterface $passwordHasher,
    private readonly EntityManagerInterface $entityManager,
    private readonly NotificacionUsuario $notificacionUsuario,
    private readonly LoggerInterface $logger
    ) {
    }


    #[Route('/api/auth/register', name: 'api_auth_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];

        if (!isset($payload['email'], $payload['password'])) {
            throw new BadRequestHttpException('Faltan campos obligatorios.');
        }

        $usuario = (new Usuario())
            ->setEmail($payload['email'])
            ->setNombre($payload['nombre'] ?? 'Nuevo usuario')
            ->setRoles($payload['roles'] ?? ['ROLE_USER']);

        $usuario->setPassword($this->passwordHasher->hashPassword($usuario, $payload['password']));

        $this->entityManager->persist($usuario);
        $this->entityManager->flush();

        try {
            if (!$this->notificacionUsuario->enviarBienvenida($usuario)) {
                $this->logger->warning('No se pudo enviar la bienvenida tras el registro.', [
                    'usuarioId' => $usuario->getId(),
                    'email' => $usuario->getEmail(),
                ]);
            }
        } catch (\Throwable $exception) {
            $this->logger->error('Fallo inesperado al enviar la bienvenida.', [
                'usuarioId' => $usuario->getId(),
                'exception' => $exception,
            ]);
        }


        return $this->json(['message' => 'Usuario registrado correctamente']);
    }

   #[Route('/api/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(): void
    {
        // Este método nunca debería ejecutarse. El firewall "login"
        // intercepta la petición y Lexik devuelve el JWT automáticamente.
        throw new \LogicException('El login JWT lo gestiona Lexik.');
    }


    #[Route('/api/me', name: 'api_auth_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $usuario = $this->getUser();

        return $this->json([
            'id' => $usuario?->getId(),
            'email' => $usuario?->getUserIdentifier(),
            'roles' => $usuario?->getRoles(),
        ]);
    }
}
