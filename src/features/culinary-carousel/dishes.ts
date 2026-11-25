export type Dish = {
  region: string
  name: string
  image: string
  ingredients: [string, string, string, string]
}

const image = (name: string) => `/images/dishes/${name}.webp`

export const dishes: Dish[] = [
  { region: 'Tamil Nadu', name: 'Masala Dosa', image: image('south-indian-dosa-feast-on-banana-leaf'), ingredients: ['Rice', 'Urad dal', 'Potatoes', 'Coconut'] },
  { region: 'Kerala', name: 'Appam & Chicken Stew', image: image('kerala-appam-and-chicken-stew-feast'), ingredients: ['Rice flour', 'Chicken', 'Coconut milk', 'Whole aromatic spices'] },
  { region: 'Chettinad', name: 'Chicken & Parotta', image: image('chettinad-chicken-and-flaky-parotta-feast'), ingredients: ['Chicken', 'Black pepper & Chettinad spices', 'Coconut', 'Maida'] },
  { region: 'Karnataka', name: 'Bisi Bele Bath', image: image('bisi-bele-bath-with-boondi-garnish'), ingredients: ['Rice', 'Toor dal', 'Mixed vegetables', 'Bisi bele bath masala'] },
  { region: 'Goa', name: 'Prawn Curry & Rice', image: image('goan-prawn-curry-with-rice'), ingredients: ['Prawns', 'Coconut milk', 'Rice', 'Tamarind & Goan spices'] },
  { region: 'Andhra Pradesh', name: 'Andhra Chicken & Rice', image: image('indian-chicken-curry-banana-leaf-platter'), ingredients: ['Chicken', 'Rice', 'Guntur red chillies', 'Andhra masala spices'] },
  { region: 'Telangana', name: 'Hyderabadi Dum Biryani', image: image('hyderabadi-chicken-dum-biryani-bowl'), ingredients: ['Basmati rice', 'Chicken', 'Fried onions', 'Aromatic spices'] },
  { region: 'Maharashtra', name: 'Pav Bhaji', image: image('overhead-pav-bhaji-on-banana-leaf'), ingredients: ['Pav', 'Potatoes & mixed vegetables', 'Butter', 'Pav bhaji masala'] },
  { region: 'Gujarat', name: 'Gujarati Thali', image: image('gujarati-thali-feast-on-brass-platter'), ingredients: ['Wheat flour', 'Rice', 'Lentils & gram flour', 'Mixed vegetables'] },
  { region: 'West Bengal', name: 'Fish Curry & Rice', image: image('bengali-fish-curry-and-rice-feast'), ingredients: ['Rohu fish', 'Rice', 'Mustard oil', 'Turmeric & green chillies'] },
  { region: 'Indo-Chinese', name: 'Schezwan Fried Rice', image: image('vibrant-schezwan-fried-rice-dome'), ingredients: ['Rice', 'Mixed vegetables', 'Schezwan sauce', 'Garlic & spring onions'] },
  { region: 'Rajasthan', name: 'Dal Baati Churma', image: image('rajasthani-dal-baati-churma-feast'), ingredients: ['Whole wheat flour', 'Mixed lentils', 'Desi ghee', 'Jaggery or sugar'] },
  { region: 'Uttar Pradesh', name: 'Lucknowi Galouti Kebab', image: image('lucknowi-galouti-kebab-feast-on-banana-leaf'), ingredients: ['Finely minced mutton', 'Raw papaya', 'Awadhi aromatic spices', 'Desi ghee'] },
  { region: 'Punjab', name: 'Butter Chicken & Naan', image: image('butter-chicken-and-naan-bowl'), ingredients: ['Chicken', 'Tomatoes', 'Butter & fresh cream', 'Garlic naan'] },
]
