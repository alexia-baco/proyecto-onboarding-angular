<?php

namespace App\Service;

use App\Entity\Usuario;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class NotificacionUsuario
{
    private const TEMPLATE_BIENVENIDA = 'emails/bienvenida.html.twig';
    private const TEMPLATE_RESET_PASSWORD = 'emails/reset_password.html.twig';



        public function __construct(
        private readonly MailerInterface $mailer,
        private readonly Environment $twig,
        private readonly ?LoggerInterface $logger = null,
        private readonly string $fromEmail = 'tucorreoprueba@todo-app.local',
        private readonly string $fromName = 'To-Do App'
    ) {
    }



        public function enviarBienvenida(Usuario $usuario): bool
    {
        $context = [
            'usuario' => $usuario,
        ];

        return $this->enviarCorreo(
            usuario: $usuario,
            asunto: 'Bienvenido a To-Do App',
            template: self::TEMPLATE_BIENVENIDA,
            contexto: $context
        );
    }



        public function enviarResetPassword(Usuario $usuario, string $passwordTemporal): bool
    {
        $context = [
            'usuario' => $usuario,
            'passwordTemporal' => $passwordTemporal,
        ];

        return $this->enviarCorreo(
            usuario: $usuario,
            asunto: 'Instrucciones para restablecer tu contraseña',
            template: self::TEMPLATE_RESET_PASSWORD,
            contexto: $context
        );
    }



        private function enviarCorreo(
        Usuario $usuario,
        string $asunto,
        string $template,
        array $contexto
    ): bool {
        $to = new Address(
            address: (string) $usuario->getEmail(),
            name: $usuario->getNombre() ?? ''
        );

        try {
            $html = $this->twig->render($template, $contexto);

            $email = (new Email())
                ->from(new Address($this->fromEmail, $this->fromName))
                ->to($to)
                ->subject($asunto)
                ->html($html);

            $this->mailer->send($email);

            return true;
        } catch (TransportExceptionInterface|\Throwable $exception) {
            $this->logger?->error('No se pudo enviar el correo al usuario.', [
                'usuarioId' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'template' => $template,
                'exception' => $exception,
            ]);

            return false;
        }
    }
}
