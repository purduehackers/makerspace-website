type EquipmentPhoto = {
  src: string;
  alt: string;
  credit?: { name: string; href: string };
};

type EquipmentItem = {
  name: string;
  detail?: string;
  photo?: EquipmentPhoto;
  specs?: { label: string; value: string }[];
};

type EquipmentSection = {
  id: string;
  title: string;
  action?: { label: string; href: string };
  groups: {
    title?: string;
    layout?: 'gallery' | 'inline';
    items: EquipmentItem[];
    note?: string;
  }[];
};

export const equipment: EquipmentSection[] = [
  {
    id: 'printing',
    title: '3D printing',
    action: { label: 'Open PrintHive', href: 'https://print.purduehackers.com/' },
    groups: [
      {
        layout: 'gallery',
        items: [
          {
            name: 'Bambu Lab H2D Pro',
            specs: [
              { label: 'Build volume', value: '350 × 320 × 325 mm total' },
              { label: 'Single nozzle', value: '325 × 320 × 325 mm' },
              { label: 'Dual nozzle', value: '300 × 320 × 325 mm' },
              { label: 'Setup', value: 'Enclosed, dual nozzle, multicolor with AMS' },
            ],
            photo: {
              src: './assets/h2d-pro.webp',
              alt: 'Bambu Lab H2D Pro with a small figurine in its illuminated chamber',
              credit: {
                name: 'MatterHackers',
                href: 'https://www.matterhackers.com/store/l/bambu-lab-h2d-pro-3d-printer/sk/MV3A78CS',
              },
            },
          },
          {
            name: 'Prusa CORE One',
            specs: [
              { label: 'Build volume', value: '250 × 220 × 270 mm' },
              { label: 'Setup', value: 'Enclosed, single nozzle' },
            ],
            photo: {
              src: './assets/core-one.webp',
              alt: 'Prusa CORE One on a workbench with an orange print in its chamber',
              credit: {
                name: 'Prusa Research',
                href: 'https://blog.prusa3d.com/introducing-prusa-core-one-fully-enclosed-corexy-3d-printer-with-active-temperature-control_105477/',
              },
            },
          },
        ],
      },
      {
        title: 'Filament',
        layout: 'inline',
        items: [{ name: 'PLA' }, { name: 'PETG', detail: 'Limited stock' }],
        note: 'Ask in #makerspace before bringing your own filament.',
      },
    ],
  },
  {
    id: 'electronics',
    title: 'Electronics',
    groups: [
      {
        title: 'Soldering and rework',
        items: [
          { name: 'Soldering irons' },
          { name: 'Pinecil soldering iron', detail: 'Heat-set insert tips' },
          { name: 'Hot-air gun' },
        ],
        note: 'No reflow oven or hot plate on site.',
      },
      {
        title: 'Wire and connectors',
        items: [
          { name: 'JST crimpers' },
          { name: 'Ferrule crimpers' },
          { name: 'Wire strippers' },
          { name: 'Cutters' },
          { name: 'Tweezers' },
        ],
      },
      {
        title: 'Prototyping supplies',
        items: [
          { name: 'Microcontrollers' },
          { name: 'Breadboards' },
          { name: 'Wire' },
          { name: 'Resistor kit' },
          { name: 'Assorted components' },
        ],
      },
    ],
  },
  {
    id: 'tools',
    title: 'Hand & power tools',
    groups: [
      {
        title: 'Power tools',
        items: [
          { name: 'Drill', detail: 'Drill bits available' },
          { name: 'Dremel' },
          { name: 'Multitool' },
        ],
        note: 'Wear safety glasses when using the drill or Dremel.',
      },
      {
        title: 'Hand tools',
        items: [
          { name: 'iFixit precision screwdriver set' },
          { name: 'Allen keys' },
          { name: 'Socket set' },
          { name: 'Pliers' },
          { name: 'Files' },
          { name: 'Sandpaper' },
        ],
      },
    ],
  },
  {
    id: 'storage',
    title: 'Project storage',
    groups: [
      {
        items: [
          { name: 'Project lockers', detail: 'Need a locker for your project? Ask in #makerspace on Discord.' },
        ],
      },
    ],
  },
];
