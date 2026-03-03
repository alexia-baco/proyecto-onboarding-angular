<?php

namespace App\Command;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crea un usuario administrador por defecto si no existe.'
)]
final class CreateAdminCommand extends Command
{
    // Constantes por defecto
    private const ADMIN_EMAIL = 'admin@example.com';
    private const ADMIN_PASSWORD = 'password123';

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }


    protected function configure(): void
    {
        $this
            ->addOption('email', null, InputOption::VALUE_OPTIONAL, 'Email del administrador', self::ADMIN_EMAIL)
            ->addOption('password', null, InputOption::VALUE_OPTIONAL, 'Contraseña plana', self::ADMIN_PASSWORD)
            ->addOption('nombre', null, InputOption::VALUE_OPTIONAL, 'Nombre del usuario', 'Admin Default')
            ->addOption('roles', null, InputOption::VALUE_OPTIONAL | InputOption::VALUE_IS_ARRAY, 'Roles del usuario', ['ROLE_ADMIN', 'ROLE_USER']);
    }


    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Vemos lo que ha escrito el usuario
        $email = (string) $input->getOption('email');
        $passwordPlano = (string) $input->getOption('password');
        $nombre = (string) $input->getOption('nombre');
        $roles = $input->getOption('roles');

        $io->title('Creación de administrador por defecto');
        $io->text(sprintf('Email objetivo: %s', $email));

        $usuarioExistente = $this->entityManager
            ->getRepository(Usuario::class)
            ->findOneBy(['email' => $email]);

        if ($usuarioExistente) {
            $io->warning('Ya existe un usuario con ese email. No se realizaron cambios.');
            return Command::SUCCESS;
        }

        // Y creamos el usuario
        $usuario = (new Usuario())
            ->setEmail($email)
            ->setNombre($nombre)
            ->setRoles($roles);

        $usuario->setPassword($this->passwordHasher->hashPassword($usuario, $passwordPlano));

        $this->entityManager->persist($usuario);
        $this->entityManager->flush();

        $io->success('Administrador creado correctamente. Cambia la contraseña al iniciar sesión.');

        return Command::SUCCESS;
    }
}