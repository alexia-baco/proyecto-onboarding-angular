<?php

namespace App\Service;

use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Psr\Log\LoggerInterface;

class AdministradorUsuarioService
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository,            // consultas reutilizables
        private readonly UserPasswordHasherInterface $passwordHasher,     // encripta las contraseñas
        private readonly EntityManagerInterface $entityManager,           // gestiona persistencia
        private readonly LoggerInterface $logger                          // registra acciones de auditoría
    ) {
    }

    /**
     * Devuelve usuarios filtrando por nombre o email si se indica.
     */
    public function listar(?string $busqueda = null): array
    {
        return $this->usuarioRepository->buscarPorEmailONombre($busqueda); // delegamos la búsqueda
    }

    /**
     * Crea un usuario con los datos proporcionados y devuelve la entidad resultante.
     */
    public function crear(array $payload): Usuario
    {
        $email = $payload['email'] ?? null;       // campos obligatorios
        $password = $payload['password'] ?? null;

        if (!$email || !$password) {
            throw new BadRequestHttpException('Email y password son obligatorios.');
        }

        
        //Le decimos al programa que busque un email.
        $usuarioExistente = $this->usuarioRepository->findOneBy(['email' => $email]);

        //Si encuemtra un usuario con ese email, que nos envíe un aviso.
        if ($usuarioExistente) {
            throw new BadRequestHttpException('Este email ya está registrado.');
        }


        $usuario = (new Usuario())
            ->setEmail($email)
            ->setNombre($payload['nombre'] ?? 'Usuario sin nombre')
            ->setRoles($payload['roles'] ?? ['ROLE_USER']); // garantiza al menos ROLE_USER

        // Importante: jamás guardes la contraseña sin hashear
        $usuario->setPassword($this->passwordHasher->hashPassword($usuario, $password));

        $this->entityManager->persist($usuario);
        $this->entityManager->flush();

        $this->logger->info('Usuario creado por admin.', ['email' => $email]); // auditoría

        return $usuario;
    }

    /**
     * Genera una contraseña temporal, la guarda hasheada y devuelve la versión en texto claro.
     */
    public function resetearPassword(Usuario $usuario): string
    {
        $passwordTemporal = bin2hex(random_bytes(4)); // 8 caracteres hexadecimales

        $usuario->setPassword($this->passwordHasher->hashPassword($usuario, $passwordTemporal));
        $this->entityManager->flush();

        $this->logger->info('Password reseteada por admin.', ['usuarioId' => $usuario->getId()]);

        return $passwordTemporal; // el controlador la devolverá para comunicarla al usuario
    }
}
