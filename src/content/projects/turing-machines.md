---
title: Turing machines
order: 4
kind: Open source
context: Rust and WebAssembly
summary: A Turing machine simulator and busy beaver search in Rust, compiled to WebAssembly for a site that runs in the browser. It re-derives BB(4) by deciding all 858,909 four-state machines in tree normal form, in agreement with the Coq-verified enumeration of the bbchallenge collaboration.
image: ../../assets/projects/turing-machines.png
imageAlt: The start page of the Turing machines site, with the five-state busy beaver champion drawn as a space-time diagram and its 47,176,870 steps and 4,098 ones measured in the browser.
links:
  - { label: Open the site, href: /turing-machines/ }
  - { label: Code, href: 'https://github.com/mooofna/turing-machines' }
---

This project began in 2024 as an exercise in the course Theoretische Informatik und Logik at TU Dresden: a Turing machine that multiplies two numbers in unary, and a program to run it. In 2026 I rewrote it as a Rust workspace. It simulates machines with one to three tapes, reads them in the notation of the course, and runs the 47,176,870 steps of the fifth busy beaver champion in 0.3 ms with chain steps on a run-length encoded tape. Ports of the deciders of the Coq proof of BB(5) decide all 858,909 four-state machines in tree normal form, and the result agrees node by node with the Coq-verified enumeration. The site compiles the workspace to WebAssembly and leads in six chapters from Turing's definition of 1936 to Antihydra, a six-state machine whose halting is an open problem.
