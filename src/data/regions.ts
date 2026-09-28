import { IndianRegion } from '../types';

export interface StateInfo {
  name: string;
  region: IndianRegion;
  popularLanguages: string[];
  vibe: string;
}

export const REGIONS_DATA: Record<IndianRegion, { description: string; states: string[] }> = {
  'South India': {
    description: 'Tech hubs, coastal culture, and rich historical heritage.',
    states: ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka', 'Kerala'],
  },
  'North India': {
    description: 'Historic capitals, mountain landscapes, and vibrant student communities.',
    states: [
      'Delhi',
      'Punjab',
      'Haryana',
      'Uttar Pradesh',
      'Uttarakhand',
      'Himachal Pradesh',
      'Jammu & Kashmir',
      'Rajasthan',
    ],
  },
  'West India': {
    description: 'Commercial heartlands, coastal ports, and bustling startup centers.',
    states: ['Maharashtra', 'Gujarat', 'Goa'],
  },
  'East India': {
    description: 'Cultural capitals, literature, river plains, and industrial hubs.',
    states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
  },
  'Northeast India': {
    description: 'Scenic hills, diverse indigenous languages, and strong English-speaking communities.',
    states: [
      'Assam',
      'Meghalaya',
      'Manipur',
      'Mizoram',
      'Nagaland',
      'Tripura',
      'Arunachal Pradesh',
      'Sikkim',
    ],
  },
};

export const ALL_INDIAN_STATES: StateInfo[] = [
  // South India
  { name: 'Andhra Pradesh', region: 'South India', popularLanguages: ['Telugu', 'English'], vibe: 'Warm, hospitable, rapid industrial and student hubs' },
  { name: 'Telangana', region: 'South India', popularLanguages: ['Telugu', 'Urdu', 'English'], vibe: 'Dynamic tech startups and cosmopolitan university life' },
  { name: 'Karnataka', region: 'South India', popularLanguages: ['Kannada', 'English'], vibe: 'Silicon Valley of India with students from every corner' },
  { name: 'Tamil Nadu', region: 'South India', popularLanguages: ['Tamil', 'English'], vibe: 'Academic excellence and manufacturing leadership' },
  { name: 'Kerala', region: 'South India', popularLanguages: ['Malayalam', 'English'], vibe: 'High literacy, coastal serenity, global connections' },

  // North India
  { name: 'Delhi', region: 'North India', popularLanguages: ['Hindi', 'Punjabi', 'English'], vibe: 'National capital, university campuses, vibrant discourse' },
  { name: 'Punjab', region: 'North India', popularLanguages: ['Punjabi', 'English', 'Hindi'], vibe: 'Energetic, entrepreneurial, and global aspirations' },
  { name: 'Haryana', region: 'North India', popularLanguages: ['Hindi', 'Haryanvi', 'English'], vibe: 'Fast-growing corporate cities like Gurugram and Faridabad' },
  { name: 'Uttar Pradesh', region: 'North India', popularLanguages: ['Hindi', 'Urdu', 'English'], vibe: 'Vast student population preparing for careers and exams' },
  { name: 'Uttarakhand', region: 'North India', popularLanguages: ['Hindi', 'Garhwali', 'English'], vibe: 'Peaceful hill universities and research institutions' },
  { name: 'Himachal Pradesh', region: 'North India', popularLanguages: ['Hindi', 'Pahari', 'English'], vibe: 'Mountain calm, creative minds, and tourism' },
  { name: 'Jammu & Kashmir', region: 'North India', popularLanguages: ['Kashmiri', 'Dogri', 'English'], vibe: 'Rich craft heritage and striving young scholars' },
  { name: 'Rajasthan', region: 'North India', popularLanguages: ['Hindi', 'Rajasthani', 'English'], vibe: 'Historic heritage, premier coaching hubs like Kota and Jaipur' },

  // West India
  { name: 'Maharashtra', region: 'West India', popularLanguages: ['Marathi', 'Hindi', 'English'], vibe: 'Financial capital Mumbai, educational hub Pune' },
  { name: 'Gujarat', region: 'West India', popularLanguages: ['Gujarati', 'Hindi', 'English'], vibe: 'Enterprise, trade, and burgeoning universities' },
  { name: 'Goa', region: 'West India', popularLanguages: ['Konkani', 'English', 'Marathi'], vibe: 'Relaxed, multicultural, and international hospitality' },

  // East India
  { name: 'West Bengal', region: 'East India', popularLanguages: ['Bengali', 'English', 'Hindi'], vibe: 'Deep literary culture, lively cafes, debate culture' },
  { name: 'Odisha', region: 'East India', popularLanguages: ['Odia', 'English'], vibe: 'Rising IT and educational institutions in Bhubaneswar' },
  { name: 'Bihar', region: 'East India', popularLanguages: ['Hindi', 'Bhojpuri', 'English'], vibe: 'Incredible dedication to civil services and competitive exams' },
  { name: 'Jharkhand', region: 'East India', popularLanguages: ['Hindi', 'English'], vibe: 'Rich mineral lands and pioneering engineering colleges' },

  // Northeast India
  { name: 'Assam', region: 'Northeast India', popularLanguages: ['Assamese', 'English', 'Bengali'], vibe: 'Gateway to the Northeast, tea gardens, bustling Guwahati' },
  { name: 'Meghalaya', region: 'Northeast India', popularLanguages: ['English', 'Khasi', 'Garo'], vibe: 'Rock music capital, strong English literacy in Shillong' },
  { name: 'Manipur', region: 'Northeast India', popularLanguages: ['Meitei', 'English'], vibe: 'Sports powerhouses and cultural resilience' },
  { name: 'Mizoram', region: 'Northeast India', popularLanguages: ['Mizo', 'English'], vibe: 'Exceptionally high literacy and tight-knit community' },
  { name: 'Nagaland', region: 'Northeast India', popularLanguages: ['English', 'Nagamese'], vibe: 'Vibrant youth culture, music, and official English state' },
  { name: 'Tripura', region: 'Northeast India', popularLanguages: ['Bengali', 'Kokborok', 'English'], vibe: 'Peaceful arts, crafts, and educational strides' },
  { name: 'Arunachal Pradesh', region: 'Northeast India', popularLanguages: ['English', 'Hindi'], vibe: 'Land of dawn-lit mountains and diverse languages' },
  { name: 'Sikkim', region: 'Northeast India', popularLanguages: ['Nepali', 'English'], vibe: 'Organic wonderland, clean living, and mountain hospitality' },
];

export function getRegionForState(stateName: string): IndianRegion {
  const found = ALL_INDIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return found ? found.region : 'South India';
}
