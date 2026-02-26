<?php

namespace App\Repository;

use App\Entity\Usuario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UsuarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Usuario::class);
    }

    public function buscarPorEmailONombre(?string $busqueda): array
    {
        if (!$busqueda) return $this->findAll();
        return $this->createQueryBuilder('u')
            ->where('u.email LIKE :val OR u.nombre LIKE :val')
            ->setParameter('val', '%' . $busqueda . '%')
            ->getQuery()
            ->getResult();
    }
}