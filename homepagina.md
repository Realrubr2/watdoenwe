<!DOCTYPE html>

<html class="light" lang="nl"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "tertiary": "#b80438",
              "tertiary-container": "#ff9099",
              "tertiary-fixed": "#ff9099",
              "error-dim": "#a70138",
              "secondary-fixed": "#69f6b8",
              "surface-tint": "#E1AD01",
              "surface-variant": "#f4f1e0",
              "surface-container-low": "#fdfcf5",
              "secondary-container": "#69f6b8",
              "primary-fixed": "#f5e4a3",
              "outline": "#7d775c",
              "tertiary-fixed-dim": "#ff7986",
              "secondary-fixed-dim": "#58e7ab",
              "secondary": "#006947",
              "inverse-on-surface": "#a09b82",
              "outline-variant": "#d3cfbc",
              "on-primary-container": "#473600",
              "primary-dim": "#c79900",
              "surface-bright": "#fffcf0",
              "inverse-surface": "#2e2b1d",
              "on-tertiary-container": "#68001b",
              "surface-container-high": "#ebe7d5",
              "primary-container": "#f5e4a3",
              "on-background": "#2e2b1d",
              "surface-container-lowest": "#ffffff",
              "on-secondary-container": "#005a3c",
              "on-secondary": "#c8ffe0",
              "error-container": "#f74b6d",
              "secondary-dim": "#005c3d",
              "on-secondary-fixed": "#00452d",
              "on-error-container": "#510017",
              "on-surface-variant": "#5e5a47",
              "background": "#fffcf0",
              "on-primary-fixed-variant": "#5c4600",
              "primary": "#E1AD01",
              "tertiary-dim": "#a20030",
              "surface-dim": "#e8e4cf",
              "on-secondary-fixed-variant": "#006544",
              "on-error": "#ffefef",
              "on-tertiary": "#ffefef",
              "inverse-primary": "#ffd966",
              "surface-container": "#f2eedb",
              "surface-container-highest": "#e8e4cf",
              "on-tertiary-fixed-variant": "#780021",
              "primary-fixed-dim": "#e1ad01",
              "on-primary": "#ffffff",
              "on-tertiary-fixed": "#39000b",
              "error": "#b41340",
              "on-surface": "#2e2b1d",
              "surface": "#fffcf0",
              "on-primary-fixed": "#000000"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Plus Jakarta Sans"],
              "label": ["Plus Jakarta Sans"]
            },
            borderRadius: {"DEFAULT": "0.375rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
        body {
            background-color: #fffcf0;
            background-image: radial-gradient(#E1AD01 0.5px, transparent 0.5px);
            background-size: 24px 24px;
            background-attachment: fixed;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="text-on-background selection:bg-primary-container selection:text-on-primary-container">
<!-- Top Navigation -->
<header class="fixed top-0 w-full z-50 bg-[#fffcf0]/80 backdrop-blur-md font-plus-jakarta text-on-surface antialiased">
<div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
<div class="text-2xl font-black text-[#E1AD01] tracking-tighter">WDW?</div>
<div class="flex gap-4">
<button class="p-2 text-[#2e2b1d]/60 hover:text-[#E1AD01] transition-colors duration-200 active:scale-90">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="p-2 text-[#2e2b1d]/60 hover:text-[#E1AD01] transition-colors duration-200 active:scale-90">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>
<main class="min-h-screen pt-32 pb-40 px-6 max-w-7xl mx-auto">
<!-- Hero Section -->
<section class="flex flex-col items-center text-center mb-24">
<div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/20 rounded-full mb-8">
<span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
<span class="text-primary font-bold text-sm tracking-wide">SOCIAL PLANNING REDEFINED</span>
</div>
<h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-3xl leading-[1.1]">
                Geen gedoe meer met <span class="text-primary italic">plannen maken.</span>
</h1>
<button class="group relative px-10 py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-md text-xl font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-3">
                Start nieuw plan
                <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
</section>
<!-- Selection Section -->
<section class="mt-16">
<div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
<div class="space-y-2">
<h2 class="text-4xl font-extrabold tracking-tight">Wat gaan we doen?</h2>
<p class="text-on-surface-variant font-medium text-lg">Kies een startpunt voor je activiteit.</p>
</div>
</div>
<!-- Bento Grid - Three Options -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<!-- Option 1: Ik weet wanneer -->
<button class="group relative flex flex-col p-8 glass-card rounded-md text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border border-white/50">
<div class="w-16 h-16 rounded-md bg-surface-container-high flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
<span class="material-symbols-outlined text-3xl" data-icon="calendar_today">calendar_today</span>
</div>
<div class="mt-auto">
<h3 class="text-2xl font-bold mb-2">Ik weet wanneer</h3>
<p class="text-on-surface-variant text-base font-medium">Vaste datum</p>
</div>
<div class="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<span class="material-symbols-outlined text-primary" data-icon="north_east">north_east</span>
</div>
</button>
<!-- Option 2: Ik weet wat -->
<button class="group relative flex flex-col p-8 glass-card rounded-md text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border border-white/50">
<div class="w-16 h-16 rounded-md bg-surface-container-high flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
<span class="material-symbols-outlined text-3xl" data-icon="favorite">favorite</span>
</div>
<div class="mt-auto">
<h3 class="text-2xl font-bold mb-2">Ik weet wat</h3>
<p class="text-on-surface-variant text-base font-medium">Vaste activiteit</p>
</div>
<div class="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<span class="material-symbols-outlined text-primary" data-icon="north_east">north_east</span>
</div>
</button>
<!-- Option 3: Geen idee nog -->
<button class="group relative flex flex-col p-8 glass-card rounded-md text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border border-white/50">
<div class="w-16 h-16 rounded-md bg-surface-container-high flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
<span class="material-symbols-outlined text-3xl" data-icon="help">help</span>
</div>
<div class="mt-auto">
<h3 class="text-2xl font-bold mb-2">Geen idee nog</h3>
<p class="text-on-surface-variant text-base font-medium">We zien wel</p>
</div>
<div class="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<span class="material-symbols-outlined text-primary" data-icon="north_east">north_east</span>
</div>
</button>
</div>
</section>
<!-- Recent Activities -->
<section class="mt-32 p-12 rounded-md bg-surface-container-low/50 border border-white/30 text-center flex flex-col items-center">
<img alt="Friends having fun" class="w-32 h-32 rounded-md object-cover mb-8 shadow-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUnqN6CJxm1OyHx0Iv1nv6V0QZe3VThhWa1hGwBnOJlFVWbX1MWvaJ9u-LjvU3S0kp-87pDTwoIMFArz8H_T2JRLs9VoMfUwe7kj7VyFdH9dj2jv4p6i0RYYyaCF_cdgXEXfdqEgBbT-0wLUD5iN4kkENz8aqkyHnwY9pmAFrhS7YrKcS1Apslrco6P1BXyRYFoBolBPannqYzj6GCFV3MxG813b9nIDhDEWzQCnrpzLsfuMMNoalgkbbJ2nSR_pdlwuzOWaPGTdQ"/>
<h4 class="text-2xl font-bold mb-4">Plan samen, beleef meer</h4>
<p class="max-w-md text-on-surface-variant font-medium leading-relaxed">
                Nodig vrienden uit, stem op data en locaties, en creëer herinneringen zonder de hoofdpijn van de planning.
            </p>
</section>
</main>
<!-- Bottom Navigation Mobile -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-8 pb-8 pt-4 bg-[#fffcf0]/90 backdrop-blur-xl z-50 shadow-[0_-8px_32px_rgba(46,43,29,0.05)] md:hidden">
<a class="flex flex-col items-center justify-center text-[#2e2b1d]/50 hover:text-[#E1AD01] transition-all" href="#">
<span class="material-symbols-outlined mb-1" data-icon="auto_awesome">auto_awesome</span>
<span class="font-plus-jakarta text-[11px] font-bold tracking-tight">Feed</span>
</a>
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#E1AD01] to-[#ffd966] text-white rounded-md w-14 h-14 -mt-10 shadow-lg active:scale-90 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="add">add</span>
</a>
<a class="flex flex-col items-center justify-center text-[#2e2b1d]/50 hover:text-[#E1AD01] transition-all" href="#">
<span class="material-symbols-outlined mb-1" data-icon="calendar_today">calendar_today</span>
<span class="font-plus-jakarta text-[11px] font-bold tracking-tight">Schedule</span>
</a>
</nav>
<!-- Desktop Floating Status Bar -->
<div class="hidden md:flex fixed bottom-8 right-8 bg-surface-container-lowest shadow-2xl rounded-md px-6 py-3 items-center gap-4 border border-white/50 z-40 backdrop-blur-sm">
<div class="flex -space-x-3">
<img alt="User" class="w-8 h-8 rounded-md border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX2dQ9XqVnXMXUc9zdQDwVySIXb80ERa85bM57glMlalGmJUsOGqI-B7c5wjg1hhIsvqlzvmt4ETIowRNNKFkYKmU7scdTZ5L1XQIKYoulpuLjz1YU9uPIzXrvZ6qce5VONTK92kjXZ2KeQ7WADNyOziGTy0_9y90OnrjujqmM4fSjXVML_0qdTyEKBF1yVMYUCjfpKhxXHCEJFbbk4FmF7Rrt8QFiINIismYXyxBDTqi0FiW4vZhiY5Qw0upC6-DwDeU6JDHKl5U"/>
<img alt="User" class="w-8 h-8 rounded-md border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5GhdO6kNfWcpt-R2Vwc4CSbUQeapiN6XDMHb5G-haHiXOORbmyga4g5ntharKiDH7Rp5V0YUVpmvsyPoco0hwSUqrSscQfgF54d5u4zBFgPfl6_-iFpdIoayLVFqJRzZslvKs_S0yOM7Csf6sSLf-CIKUIPMyylky410-d6KHMSnNdhSzb4KIx3upfNlC8m9Z2LOkaA6D594BJBpBXKd2cfkQhY82VDtdR-3v_mvY4lihdroCHNNVbfPwS5909XcnqgbPhJr9GCc"/>
<div class="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center text-[10px] font-bold border-2 border-white">+3</div>
</div>
<div class="h-6 w-[1px] bg-outline-variant/30"></div>
<span class="text-sm font-bold text-on-surface">2 actieve plannen</span>
<button class="material-symbols-outlined text-primary text-xl" data-icon="open_in_new">open_in_new</button>
</div>
</body></html>