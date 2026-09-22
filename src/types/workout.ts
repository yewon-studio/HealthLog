export const WorkoutType = {
  PILATES: 'PILATES',
  GYM: 'GYM',
} as const;

export type WorkoutType = (typeof WorkoutType)[keyof typeof WorkoutType];

export const BodyPart = {
  FULL_BODY: 'FULL_BODY',
  CHEST: 'CHEST',
  CHEST_UPPER: 'CHEST_UPPER',
  CHEST_LOWER: 'CHEST_LOWER',
  BACK: 'BACK',
  LAT: 'LAT',
  TRAPEZIUS: 'TRAPEZIUS',
  RHOMBOID: 'RHOMBOID',
  SHOULDER: 'SHOULDER',
  SHOULDER_FRONT: 'SHOULDER_FRONT',
  SHOULDER_SIDE: 'SHOULDER_SIDE',
  SHOULDER_REAR: 'SHOULDER_REAR',
  ARM: 'ARM',
  BICEP: 'BICEP',
  TRICEP: 'TRICEP',
  FOREARM: 'FOREARM',
  LOWER_BODY: 'LOWER_BODY',
  GLUTE: 'GLUTE',
  CORE: 'CORE',
  ABDOMEN: 'ABDOMEN',
  OBLIQUE: 'OBLIQUE',
  WAIST: 'WAIST',
  SPINE: 'SPINE',
  PELVIS: 'PELVIS',
  QUAD: 'QUAD',
  HAMSTRING: 'HAMSTRING',
  INNER_THIGH: 'INNER_THIGH',
  CALF: 'CALF',
  ANKLE: 'ANKLE',
  FOOT: 'FOOT',
  FLEXIBILITY: 'FLEXIBILITY',
  POSTURE: 'POSTURE',
} as const;

export type BodyPart = (typeof BodyPart)[keyof typeof BodyPart];

export interface WorkoutRecord {
  id: string;
  date: string;
  type: WorkoutType;
  count: number;
  bodyParts: BodyPart[];
  createdAt: string;
  updatedAt: string;
}

export interface BodyPartOption {
  id: BodyPart;
  label: string;
}

export interface BodyPartGroup {
  id: string;
  label: string;
  parts: BodyPartOption[];
}

export const PILATES_BODY_PART_GROUPS: BodyPartGroup[] = [
  {
    id: 'upper',
    label: '상체',
    parts: [
      { id: BodyPart.FULL_BODY, label: '전신' },
      { id: BodyPart.SHOULDER, label: '어깨' },
      { id: BodyPart.ARM, label: '팔' },
      { id: BodyPart.BACK, label: '등' },
      { id: BodyPart.CHEST, label: '가슴' },
    ],
  },
  {
    id: 'core',
    label: '코어',
    parts: [
      { id: BodyPart.CORE, label: '코어' },
      { id: BodyPart.ABDOMEN, label: '복부' },
      { id: BodyPart.OBLIQUE, label: '옆구리' },
      { id: BodyPart.WAIST, label: '허리' },
      { id: BodyPart.SPINE, label: '척추' },
    ],
  },
  {
    id: 'lower',
    label: '골반 · 하체',
    parts: [
      { id: BodyPart.PELVIS, label: '골반' },
      { id: BodyPart.GLUTE, label: '둔근' },
      { id: BodyPart.QUAD, label: '허벅지 앞' },
      { id: BodyPart.HAMSTRING, label: '허벅지 뒤' },
      { id: BodyPart.INNER_THIGH, label: '허벅지 안쪽' },
      { id: BodyPart.CALF, label: '종아리' },
      { id: BodyPart.ANKLE, label: '발목' },
      { id: BodyPart.FOOT, label: '발/발바닥' },
    ],
  },
];

export const GYM_BODY_PART_GROUPS: BodyPartGroup[] = [
  {
    id: 'full',
    label: '전신',
    parts: [{ id: BodyPart.FULL_BODY, label: '전신' }],
  },
  {
    id: 'chest',
    label: '가슴',
    parts: [
      { id: BodyPart.CHEST, label: '가슴 전체' },
      { id: BodyPart.CHEST_UPPER, label: '상부 가슴' },
      { id: BodyPart.CHEST_LOWER, label: '하부 가슴' },
    ],
  },
  {
    id: 'back',
    label: '등',
    parts: [
      { id: BodyPart.BACK, label: '등 전체' },
      { id: BodyPart.LAT, label: '광배근' },
      { id: BodyPart.TRAPEZIUS, label: '승모근' },
      { id: BodyPart.RHOMBOID, label: '능형근' },
    ],
  },
  {
    id: 'shoulder',
    label: '어깨',
    parts: [
      { id: BodyPart.SHOULDER, label: '어깨 전체' },
      { id: BodyPart.SHOULDER_FRONT, label: '전면 어깨' },
      { id: BodyPart.SHOULDER_SIDE, label: '측면 어깨' },
      { id: BodyPart.SHOULDER_REAR, label: '후면 어깨' },
    ],
  },
  {
    id: 'arm',
    label: '팔',
    parts: [
      { id: BodyPart.BICEP, label: '이두근' },
      { id: BodyPart.TRICEP, label: '삼두근' },
      { id: BodyPart.FOREARM, label: '전완근' },
    ],
  },
  {
    id: 'core',
    label: '코어',
    parts: [
      { id: BodyPart.CORE, label: '코어' },
      { id: BodyPart.ABDOMEN, label: '복근' },
      { id: BodyPart.OBLIQUE, label: '옆구리' },
      { id: BodyPart.WAIST, label: '허리' },
    ],
  },
  {
    id: 'lower',
    label: '하체',
    parts: [
      { id: BodyPart.GLUTE, label: '둔근' },
      { id: BodyPart.QUAD, label: '허벅지 앞' },
      { id: BodyPart.HAMSTRING, label: '허벅지 뒤' },
      { id: BodyPart.INNER_THIGH, label: '허벅지 안쪽' },
      { id: BodyPart.CALF, label: '종아리' },
    ],
  },
];

export const PILATES_BODY_PARTS: BodyPart[] = PILATES_BODY_PART_GROUPS.flatMap(
  (group) => group.parts.map((part) => part.id),
);

export const GYM_BODY_PARTS: BodyPart[] = GYM_BODY_PART_GROUPS.flatMap((group) =>
  group.parts.map((part) => part.id),
);

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  FULL_BODY: '전신',
  CHEST: '가슴',
  CHEST_UPPER: '상부 가슴',
  CHEST_LOWER: '하부 가슴',
  BACK: '등',
  LAT: '광배근',
  TRAPEZIUS: '승모근',
  RHOMBOID: '능형근',
  SHOULDER: '어깨',
  SHOULDER_FRONT: '전면 어깨',
  SHOULDER_SIDE: '측면 어깨',
  SHOULDER_REAR: '후면 어깨',
  ARM: '팔',
  BICEP: '이두근',
  TRICEP: '삼두근',
  FOREARM: '전완근',
  LOWER_BODY: '하체',
  GLUTE: '둔근',
  CORE: '코어',
  ABDOMEN: '복부',
  OBLIQUE: '옆구리',
  WAIST: '허리',
  SPINE: '척추',
  PELVIS: '골반',
  QUAD: '허벅지 앞',
  HAMSTRING: '허벅지 뒤',
  INNER_THIGH: '허벅지 안쪽',
  CALF: '종아리',
  ANKLE: '발목',
  FOOT: '발/발바닥',
  FLEXIBILITY: '유연성',
  POSTURE: '자세교정',
};

const KNOWN_BODY_PARTS = new Set<string>(Object.values(BodyPart));

export function isBodyPart(value: string): value is BodyPart {
  return KNOWN_BODY_PARTS.has(value);
}

export function bodyPartLabel(part: string): string {
  return isBodyPart(part) ? BODY_PART_LABELS[part] : part;
}
