<?php

namespace App\Repository;

use App\Entity\Tarea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TareaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tarea::class);
    }

    public function buscarPorFiltros(int $usuarioId, ?string $estado, ?string $texto): array
    {
        $qb = $this->createQueryBuilder('t')
            ->where('t.usuario = :user_id')
            ->setParameter('user_id', $usuarioId);

        if ($estado) {
            $qb->andWhere('t.estado = :estado')->setParameter('estado', $estado);
        }
        if ($texto) {
            $qb->andWhere('t.titulo LIKE :texto OR t.descripcion LIKE :texto')
               ->setParameter('texto', '%' . $texto . '%');
        }
        return $qb->getQuery()->getResult();
    }
}