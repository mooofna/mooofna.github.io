---
title: MuCoDi Chest CT
order: 2
kind: Bachelor thesis
context: Harvard Medical School and MGH, 2026
summary: Six published CT foundation models benchmarked on 11 cohorts, the two strongest distilled into 14 compact 3D models. With an MLP probe, a 3M-parameter student comes within 0.2 AUROC points of its 79M-parameter teacher. A web demo runs the students on your own CPU.
image: ../../assets/projects/radiology-thesis.jpg
imageAlt: The reading room of the MuCoDi Chest CT demo, a chest CT in coronal, sagittal, axial and 3D views next to the result of encoding it with the smallest student, TMIN, in 0.53 s on one CPU thread, against a projected 43.9 s for Pillar-0.
imageCredit: 'Scan: LIDC-IDRI-0001, The Cancer Imaging Archive, CC BY 3.0.'
links:
  - { label: Open the demo, href: /mucodi-radiology/ }
  - { label: Code, href: 'https://github.com/mooofna/mucodi-radiology' }
---

My Bachelor thesis, _On the Parameter-Performance Trade-Off of Radiology Foundation Models_, written at Harvard Medical School and Massachusetts General Hospital (grade 1.0).

I benchmarked six published CT foundation models on 11 cohorts and distilled the two strongest into 14 compact 3D models with 0.04M to 44M parameters. I trained them with PyTorch DDP on up to eight A100 GPUs (about 2,260 GPU-hours) and compared them with patient-clustered bootstrap confidence intervals and paired bootstrap tests. With an MLP probe, a 3M-parameter student comes within 0.2 AUROC points of its 79M-parameter teacher. The evaluation runs in a tested package whose outputs match the original models byte for byte.

A web demo runs all 14 students in the browser, on the visitor's own CPU: the evaluation preprocessing ported to TypeScript, a view of each network stage's feature maps in 2D and 3D, and a race against the teachers' single-core times. On one CPU thread the smallest student embeds a chest CT in under a second, while the Pillar-0 teacher takes over a minute.
