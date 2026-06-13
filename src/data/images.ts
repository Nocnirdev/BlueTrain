// BlueTrain — Exercise images
// All images are from Wikimedia Commons with verified free licenses.
// Attribution and source URL are stored for legal compliance.

export interface ExerciseImage {
  url: string;
  alt: string;
  author: string;
  license: string;
  source: string; // Wikimedia Commons file page
}

export const EXERCISE_IMAGES: Record<string, ExerciseImage[]> = {

  'back-squat': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Woman_doing_squat_workout_in_gym_with_barbell.jpg',
    alt: 'Barbell back squat',
    author: 'Nenad Stojkovic',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Woman_doing_squat_workout_in_gym_with_barbell.jpg',
  }],

  'deadlift': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Fit_young_man_doing_deadlift_exercise_in_gym.jpg',
    alt: 'Deadlift con barra',
    author: 'Nenad Stojkovic',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Fit_young_man_doing_deadlift_exercise_in_gym.jpg',
  }],

  'pull-up': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Girl_doing_pull-ups_-_48441668177.jpg',
    alt: 'Pull-up / dominada',
    author: 'Tyler Read / PTPioneer',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Girl_doing_pull-ups_-_48441668177.jpg',
  }],

  'push-up-dog': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Push-up.jpg',
    alt: 'Flexión / push-up',
    author: 'Dr Qingwei Chen',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Push-up.jpg',
  }],

  'running': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Jogging_and_wellness.jpg',
    alt: 'Carrera / jogging',
    author: 'Effectzda Change',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Jogging_and_wellness.jpg',
  }],

  'burpee': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Airborne_Burpee.jpg',
    alt: 'Burpee ejercicio',
    author: 'Sgt. Ryan Young, U.S. Marine Corps',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Airborne_Burpee.jpg',
  }],

  'burpee-broad': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Airborne_Burpee.jpg',
    alt: 'Burpee broad jump',
    author: 'Sgt. Ryan Young, U.S. Marine Corps',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Airborne_Burpee.jpg',
  }],

  'plank-rkc': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Girl_exercising_doing_plank_on_stability_ball.jpg',
    alt: 'Plancha RKC',
    author: 'Tyler Read / PTPioneer',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Girl_exercising_doing_plank_on_stability_ball.jpg',
  }],

  'walking-lunges': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Low_Lunge.jpg',
    alt: 'Walking lunges / zancada',
    author: 'BameSanah88',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Low_Lunge.jpg',
  }],

  'jumping-jacks': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/A_display_of_Jumping_Jack_Cardio_Exercise_at_Orji_Flyover_Owerri%2C_Imo_State.jpg',
    alt: 'Jumping jacks',
    author: 'Dolphyb',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:A_display_of_Jumping_Jack_Cardio_Exercise_at_Orji_Flyover_Owerri,_Imo_State.jpg',
  }],

  'kb-swing': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Kettlebell_swing_with_arms_fully_extended.jpg',
    alt: 'Kettlebell swing ruso',
    author: 'Taco Fleur',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Kettlebell_swing_with_arms_fully_extended.jpg',
  }],

  'pigeon-pose': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Kapotasana_-_Pigeon_pose.jpg',
    alt: 'Pigeon pose / paloma yoga',
    author: 'Barry Silver / Govinda Kai',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Kapotasana_-_Pigeon_pose.jpg',
  }],

  'child-pose': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/ChildsPose3.jpg',
    alt: "Child's pose / postura del niño",
    author: 'Nolabob',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:ChildsPose3.jpg',
  }],

  'cat-cow': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Yoga_at_Your_Park_-_Bitilasana.jpg',
    alt: 'Cat-cow / vaca yoga',
    author: 'Mary O\'Neill, National Park Service',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Yoga_at_Your_Park_-_Bitilasana.jpg',
  }],

  'hamstring-stretch': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Woman_on_the_yoga_mat_stretching_her_hamstrings_-_50398044188.jpg',
    alt: 'Estiramiento de isquios',
    author: 'Nenad Stojkovic',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Woman_on_the_yoga_mat_stretching_her_hamstrings_-_50398044188.jpg',
  }],

  'farmer-carry': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Farmers_walk.jpg',
    alt: 'Farmer carry / caminata con peso',
    author: 'Michelle Tribe',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Farmers_walk.jpg',
  }],

  'suitcase-carry': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Farmers_walk.jpg',
    alt: 'Suitcase carry / caminata maletín',
    author: 'Michelle Tribe',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Farmers_walk.jpg',
  }],

  'wall-ball': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Competition_begins_120408-A-VX278-004.jpg',
    alt: 'Wall ball ejercicio',
    author: 'Sgt. Ruth Pagán, U.S. Army',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Competition_begins_120408-A-VX278-004.jpg',
  }],

  'row-machine': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Rowing_Machines.jpg',
    alt: 'Máquina de remo',
    author: 'Airman 1st Class Erin Currie, U.S. Air Force',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Rowing_Machines.jpg',
  }],

  'row-warmup': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Rowing_Machines.jpg',
    alt: 'Calentamiento en remo',
    author: 'Airman 1st Class Erin Currie, U.S. Air Force',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Rowing_Machines.jpg',
  }],

  'sled-push': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Marine_sled_push.jpg',
    alt: 'Sled push / empuje de trineo',
    author: 'Kaitlin Kelly, Marine Corps Systems Command',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Marine_sled_push.jpg',
  }],

  'bird-dog': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Bird_dog_exercise.jpg',
    alt: 'Bird dog ejercicio de core',
    author: 'Tyler Read / PTPioneer',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Bird_dog_exercise.jpg',
  }],

  'squat-jump': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Jumping_split_squat_with_dumbbells_1.png',
    alt: 'Squat jump pliométrico',
    author: 'RickyBennison',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Jumping_split_squat_with_dumbbells_1.png',
  }],

  'mountain-climber': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Staying_%27kid%27_fit_all_spring_long_140317-M-TH981-003.jpg',
    alt: 'Mountain climbers ejercicio',
    author: 'Kristen Wong, U.S. Marine Corps',
    license: 'Public Domain',
    source: 'https://commons.wikimedia.org/wiki/File:Staying_%27kid%27_fit_all_spring_long_140317-M-TH981-003.jpg',
  }],

  'breathing': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Diaphragmatic_breathing.gif',
    alt: 'Respiración diafragmática — movimiento del diafragma al inhalar y exhalar',
    author: 'John Pierce',
    license: 'CC0 1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Diaphragmatic_breathing.gif',
  }],

  'db-row': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Rear_deltoid_row_dumbbell_1.svg',
    alt: 'Remo con mancuerna (rear deltoid row)',
    author: 'Everkinetic',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Rear_deltoid_row_dumbbell_1.svg',
  }],

  'glute-bridge': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Glute-bridge.png',
    alt: 'Puente de glúteos (glute bridge)',
    author: 'Marianne Gilbak',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Glute-bridge.png',
  }],

  'hammer-curl': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Alternating_hammer_curl_with_dumbbell_1.svg',
    alt: 'Hammer curl alternado con mancuerna',
    author: 'Everkinetic',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Alternating_hammer_curl_with_dumbbell_1.svg',
  }],

  'jump-rope': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Man_Jumping_Rope_%28Lincoln_Road_Mall%29.jpg',
    alt: 'Salto a la comba / cuerda',
    author: 'Tamanoeconomico',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Man_Jumping_Rope_(Lincoln_Road_Mall).jpg',
  }],

  'scap-pullup': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Pullup.gif',
    alt: 'Scapular pull-up desde dead hang',
    author: 'Extremistpullup',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Pullup.gif',
  }],

  'ski-erg': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/CrossFit_workout_on_SkiErg_DSC1807.jpg',
    alt: 'Atleta en máquina SkiErg CrossFit',
    author: 'Kiet Le',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:CrossFit_workout_on_SkiErg_DSC1807.jpg',
  }],

  'ski-erg-warm': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/CWV_%28562_of_13%29_-_FRIYAY_Roux_Fitness%2C_Jefferson_Louisiana_April_2022.jpg',
    alt: 'Calentamiento en SkiErg en gimnasio CrossFit',
    author: 'Colin Van Dervort',
    license: 'CC BY 2.0',
    source: 'https://commons.wikimedia.org/wiki/File:CWV_(562_of_13)_-_FRIYAY_Roux_Fitness,_Jefferson_Louisiana_April_2022.jpg',
  }],

  'sl-deadlift': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Romanian-deadlift-1.png',
    alt: 'Peso muerto rumano / single leg deadlift',
    author: 'Everkinetic',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Romanian-deadlift-1.png',
  }],

  'sled-pull': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Chicago_2021_US_Championships_sled_push.png',
    alt: 'Sled push/pull en competición HYROX Chicago 2021',
    author: 'HybridFitty',
    license: 'CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Chicago_2021_US_Championships_sled_push.png',
  }],

  'supine-twist': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Waist_Rotating_Pose.jpg',
    alt: 'Torsión espinal reclinada (supine twist)',
    author: 'Satheesan.vn',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Waist_Rotating_Pose.jpg',
  }],

  'tricep-extension': [{
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Standing-overhead-triceps-extension-1.gif',
    alt: 'Extensión de tríceps por encima de la cabeza',
    author: 'Everkinetic',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Standing-overhead-triceps-extension-1.gif',
  }],
};
