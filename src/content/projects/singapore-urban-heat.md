---
title: Singapore Urban Heat
order: 3
kind: Open source
context: Web map, updated monthly
summary: Surface heat in Singapore from every clear Landsat 8 and 9 scene since 2013, explained with spatial econometrics, on a web map that a scheduled workflow updates every month.
image: ../../assets/projects/singapore-urban-heat.png
imageAlt: The Singapore Urban Heat explorer, a dark map of Singapore with 200 m hexagons coloured from blue (cooler) to red (hotter) by relative surface heat.
live: singapore-urban-heat
links:
  - { label: Open the map, href: /singapore-urban-heat/ }
  - { label: Code, href: 'https://github.com/mooofna/singapore-urban-heat' }
---

Singapore Urban Heat grew out of a course project at NTU Singapore and is a complete rewrite. It measures surface heat on a 200 m hexagon grid from every clear Landsat 8 and 9 scene since 2013, explains it with spatial lag, error and Durbin models, and publishes a static web map. A scheduled GitHub workflow fetches new scenes every month and redeploys the map without a backend.
