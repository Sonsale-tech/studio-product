import { TestSuite } from '../types';

export const DEFAULT_TEST_SUITES: TestSuite[] = [
  {
    id: 'test-1',
    name: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
    description: 'Basic concepts of energy bands, forbidden gap, intrinsic and doped semiconductors.',
    category: 'Physics Class XII',
    questions: [
      {
        id: 'q1-1',
        testName: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
        qNo: 1,
        q: 'What is the approximate energy band gap \\(E_g\\) for Silicon (Si) and Germanium (Ge) at \\(300\\text{ K}\\)?',
        options: [
          '\\(E_g(\\text{Si}) = 1.1\\text{ eV}, E_g(\\text{Ge}) = 0.72\\text{ eV}\\)',
          '\\(E_g(\\text{Si}) = 0.72\\text{ eV}, E_g(\\text{Ge}) = 1.1\\text{ eV}\\)',
          '\\(E_g(\\text{Si}) = 3.0\\text{ eV}, E_g(\\text{Ge}) = 5.4\\text{ eV}\\)',
          '\\(E_g(\\text{Si}) = 0\\text{ eV}, E_g(\\text{Ge}) = 0.1\\text{ eV}\\)'
        ],
        answer: 'A',
        explanation: 'At room temperature (300 K), the forbidden energy band gap is 1.1 eV for Silicon and 0.72 eV for Germanium.'
      },
      {
        id: 'q1-2',
        testName: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
        qNo: 2,
        q: 'In an intrinsic semiconductor, the Fermi energy level \\(E_F\\) lies:',
        options: [
          'In the conduction band',
          'Near the valence band',
          'Exactly halfway between the valence and conduction bands',
          'Below the valence band'
        ],
        answer: 'C',
        explanation: 'In pure intrinsic semiconductors, electron and hole concentrations are equal, placing the Fermi level directly in the middle of the energy band gap.'
      },
      {
        id: 'q1-3',
        testName: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
        qNo: 3,
        q: 'Which of the following elements is used as a trivalent impurity (acceptor) to produce a p-type semiconductor?',
        options: [
          'Phosphorus (P)',
          'Arsenic (As)',
          'Indium (In) / Boron (B)',
          'Antimony (Sb)'
        ],
        answer: 'C',
        explanation: 'Group 13 elements (Boron, Aluminum, Gallium, Indium) are trivalent and accept electrons, creating majority hole carriers (p-type).'
      },
      {
        id: 'q1-4',
        testName: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
        qNo: 4,
        q: 'According to the law of mass action in semiconductors at thermal equilibrium, what is the relation between electron density \\(n_e\\), hole density \\(n_h\\), and intrinsic concentration \\(n_i\\)?',
        options: [
          '\\(n_e + n_h = n_i^2\\)',
          '\\(n_e \\cdot n_h = n_i^2\\)',
          '\\(n_e / n_h = n_i\\)',
          '\\(n_e^2 \\cdot n_h^2 = n_i\\)'
        ],
        answer: 'B',
        explanation: 'The law of mass action states that the product of free electrons and holes remains constant at a given temperature: \\(n_e \\cdot n_h = n_i^2\\).'
      },
      {
        id: 'q1-5',
        testName: 'Semiconductor Practice Test 1 - Band Theory & Intrinsic/Extrinsic',
        qNo: 5,
        q: 'When the temperature of an intrinsic semiconductor is increased, its electrical conductivity:',
        options: [
          'Decreases linearly',
          'Remains unchanged',
          'Increases exponentially because covalent bonds break to generate electron-hole pairs',
          'Drops to zero'
        ],
        answer: 'C',
        explanation: 'Semiconductors have a negative temperature coefficient of resistance; increasing temperature generates more charge carriers across the band gap.'
      }
    ]
  },
  {
    id: 'test-2',
    name: 'Semiconductor Practice Test 2 - P-N Junction & Diodes',
    description: 'Depletion layer, barrier potential, forward/reverse bias characteristics and rectifiers.',
    category: 'Physics Class XII',
    questions: [
      {
        id: 'q2-1',
        testName: 'Semiconductor Practice Test 2 - P-N Junction & Diodes',
        qNo: 1,
        q: 'Across a p-n junction in thermal equilibrium with no external bias, what constitutes the depletion layer?',
        options: [
          'Mobile electrons and holes only',
          'Immobile positive donor ions on the n-side and immobile negative acceptor ions on the p-side',
          'Free valence electrons only',
          'Only neutral silicon atoms'
        ],
        answer: 'B',
        explanation: 'The depletion region is depleted of mobile charge carriers and consists solely of uncompensated immobile ionized donor and acceptor atoms.'
      },
      {
        id: 'q2-2',
        testName: 'Semiconductor Practice Test 2 - P-N Junction & Diodes',
        qNo: 2,
        q: 'The barrier potential \\(V_0\\) across a Silicon p-n junction at room temperature is approximately:',
        options: [
          '\\(0.2\\text{ V}\\)',
          '\\(0.7\\text{ V}\\)',
          '\\(1.5\\text{ V}\\)',
          '\\(5.0\\text{ V}\\)'
        ],
        answer: 'B',
        explanation: 'Silicon p-n junction diodes have a built-in barrier potential of approximately 0.7 V, whereas Germanium is about 0.3 V.'
      },
      {
        id: 'q2-3',
        testName: 'Semiconductor Practice Test 2 - P-N Junction & Diodes',
        qNo: 3,
        q: 'In a full-wave bridge rectifier operating on a \\(50\\text{ Hz}\\) AC mains supply, the output ripple frequency is:',
        options: [
          '\\(25\\text{ Hz}\\)',
          '\\(50\\text{ Hz}\\)',
          '\\(100\\text{ Hz}\\)',
          '\\(200\\text{ Hz}\\)'
        ],
        answer: 'C',
        explanation: 'For a full-wave rectifier, both half-cycles are rectified, doubling the output frequency: \\(f_{\\text{out}} = 2 \\times f_{\\text{in}} = 2 \\times 50\\text{ Hz} = 100\\text{ Hz}\\).'
      },
      {
        id: 'q2-4',
        testName: 'Semiconductor Practice Test 2 - P-N Junction & Diodes',
        qNo: 4,
        q: 'A Zener diode is specially designed to operate predominantly in which region of its I-V characteristic?',
        options: [
          'Forward bias active region',
          'Reverse bias breakdown region under heavy doping',
          'Cut-off region only',
          'Saturation region'
        ],
        answer: 'B',
        explanation: 'Zener diodes are heavily doped p-n junctions designed to operate in reverse breakdown voltage with a very thin depletion layer to provide voltage regulation.'
      },
      {
        id: 'q2-5',
        testName: 'Semiconductor Practice Test 2 - P-N Junction & Diodes',
        qNo: 5,
        q: 'A Light Emitting Diode (LED) emits photon radiation when it is operated in:',
        options: [
          'Forward bias, where recombining electrons and holes release energy \\(h\\nu \\approx E_g\\)',
          'Reverse bias breakdown',
          'Zero bias equilibrium',
          'Heavy reverse bias avalanche multiplication'
        ],
        answer: 'A',
        explanation: 'In forward bias, excess carriers injected across the junction recombine radiatively, releasing energy equal to the band gap in the form of light.'
      }
    ]
  },
  {
    id: 'test-3',
    name: 'Semiconductor Practice Test 3 - Logic Gates & Transistors',
    description: 'Digital logic gates, truth tables, boolean algebra, and BJT current gains.',
    category: 'Physics Class XII',
    questions: [
      {
        id: 'q3-1',
        testName: 'Semiconductor Practice Test 3 - Logic Gates & Transistors',
        qNo: 1,
        q: 'Which logic gate produces an output \\(Y = 1\\) only when both inputs \\(A\\) and \\(B\\) are \\(0\\)?',
        options: [
          'NAND Gate (\\(Y = \\overline{A \\cdot B}\\))',
          'NOR Gate (\\(Y = \\overline{A + B}\\))',
          'XOR Gate (\\(Y = A \\oplus B\\))',
          'AND Gate (\\(Y = A \\cdot B\\))'
        ],
        answer: 'B',
        explanation: 'For a NOR gate: when \\(A=0, B=0\\), \\(Y = \\overline{0+0} = \\overline{0} = 1\\). For any input with 1, output is 0.'
      },
      {
        id: 'q3-2',
        testName: 'Semiconductor Practice Test 3 - Logic Gates & Transistors',
        qNo: 2,
        q: 'The relation between common emitter current gain \\(\\beta\\) and common base current gain \\(\\alpha\\) of a transistor is:',
        options: [
          '\\(\\beta = \\frac{\\alpha}{1 - \\alpha}\\)',
          '\\(\\beta = \\frac{1 - \\alpha}{\\alpha}\\)',
          '\\(\\beta = \\alpha (1 + \\alpha)\\)',
          '\\(\\beta = \\frac{1}{\\alpha}\\)'
        ],
        answer: 'A',
        explanation: 'Since \\(I_E = I_B + I_C\\), dividing by \\(I_C\\) gives \\(\\frac{1}{\\alpha} = \\frac{1}{\\beta} + 1\\), which rearranges to \\(\\beta = \\frac{\\alpha}{1 - \\alpha}\\).'
      },
      {
        id: 'q3-3',
        testName: 'Semiconductor Practice Test 3 - Logic Gates & Transistors',
        qNo: 3,
        q: 'Which pair of logic gates are known as Universal Logic Gates?',
        options: [
          'AND and OR',
          'NAND and NOR',
          'NOT and XOR',
          'OR and NOT'
        ],
        answer: 'B',
        explanation: 'NAND and NOR gates are universal gates because any boolean logic function can be constructed using only NAND or only NOR gates.'
      },
      {
        id: 'q3-4',
        testName: 'Semiconductor Practice Test 3 - Logic Gates & Transistors',
        qNo: 4,
        q: 'In a transistor amplifier in common emitter configuration, the phase difference between input signal voltage and output signal voltage is:',
        options: [
          '\\(0^\\circ\\) (in phase)',
          '\\(90^\\circ\\)',
          '\\(180^\\circ\\) (\\(\\pi\\text{ radians}\\))',
          '\\(270^\\circ\\)'
        ],
        answer: 'C',
        explanation: 'In common emitter amplifiers, as the input voltage increases, collector current increases causing a larger drop across the collector resistor, inverting the output by 180 degrees.'
      },
      {
        id: 'q3-5',
        testName: 'Semiconductor Practice Test 3 - Logic Gates & Transistors',
        qNo: 5,
        q: 'According to De Morgan\'s second theorem, \\(\\overline{A \\cdot B}\\) is logically equivalent to:',
        options: [
          '\\(\\overline{A} \\cdot \\overline{B}\\)',
          '\\(\\overline{A} + \\overline{B}\\)',
          '\\(A + B\\)',
          '\\(A \\cdot B\\)'
        ],
        answer: 'B',
        explanation: 'De Morgan\'s theorem states that the complement of a product is the sum of complements: \\(\\overline{A \\cdot B} = \\overline{A} + \\overline{B}\\).'
      }
    ]
  }
];
