---
title: MuCoDi
order: 1
kind: Paper
context: MICCAI 2026 Workshop on Efficient Medical AI
award: Best Paper Award
summary: Multi-teacher contrastive distillation of pathology foundation models into edge models. A 6.4M-parameter student, 99x smaller than the best teacher, comes within 0.9 AUROC points of it on external data.
image: ../../assets/projects/mucodi-overview.jpg
imageAlt: Overview of MuCoDi pretraining. Tiles from a whole-slide image go through a trained student and frozen teachers (Virchow2, UNI2, H-Optimus-1); teacher-specific projection heads are trained with a contrastive loss.
plate: true
links:
  - { label: Paper, href: 'https://arxiv.org/abs/2607.05533' }
  - { label: Code, href: 'https://github.com/KatherLab/MuCoDi' }
---

Shared first author with Tim Lenz, at the EKFZ for Digital Health in Dresden. The paper received the Best Paper Award at the MICCAI 2026 Workshop on Efficient Medical AI.

We distill Virchow2, UNI2 and H-Optimus-1 (632M to 1.1B parameters) into MobileOne and RepViT students, trained with PyTorch DDP, global batch 2048 and bf16 on 14.3M tiles from 11.8K whole-slide images. A 6.4M-parameter student comes within 0.9 AUROC points of the best teacher on external data, and sub-million-parameter students run up to 605x faster on a Raspberry Pi 5.
