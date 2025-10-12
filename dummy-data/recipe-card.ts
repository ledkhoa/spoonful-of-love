export type RecipeCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isSaved: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  minMonths: number;
  maxMonths?: number;
};

export const dummyRecipes: RecipeCard[] = [
  {
    id: '1',
    title: 'Fluffy Banana Pancakes',
    description:
      'Naturally sweet pancakes perfect for little hands. Made with ripe bananas and whole wheat flour.',
    imageUrl:
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 245,
    isSaved: true,
    isFeatured: true,
    isPremium: true,
    minMonths: 6,
    maxMonths: 24,
  },
  {
    id: '2',
    title: 'Mini Veggie Muffins',
    description:
      'Hidden vegetables in delicious muffins. Packed with carrots, zucchini, and sweet potato.',
    imageUrl:
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 189,
    isSaved: false,
    isFeatured: false,
    isPremium: false,
    minMonths: 8,
    maxMonths: 36,
  },
  {
    id: '3',
    title: 'Creamy Mac & Cheese Bites',
    description:
      'Bite-sized mac and cheese perfect for toddler fingers. Made with real cheese and hidden cauliflower.',
    imageUrl:
      'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 312,
    isSaved: true,
    isFeatured: true,
    isPremium: false,
    minMonths: 12,
    maxMonths: 48,
  },
  {
    id: '4',
    title: 'Sweet Potato Fries',
    description:
      'Crispy baked sweet potato fries with a hint of cinnamon. A healthy alternative to regular fries.',
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 156,
    isSaved: false,
    isFeatured: false,
    isPremium: true,
    minMonths: 8,
    maxMonths: 36,
  },
  {
    id: '5',
    title: 'Apple Cinnamon Oatmeal',
    description:
      'Warm, comforting oatmeal with fresh apples and cinnamon. Perfect for breakfast or snack time.',
    imageUrl:
      'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 98,
    isSaved: true,
    isFeatured: false,
    isPremium: false,
    minMonths: 6,
    maxMonths: 24,
  },
  {
    id: '6',
    title: 'Chicken & Rice Balls',
    description:
      'Soft, flavorful rice balls with tender chicken pieces. Easy to hold and perfect for little ones.',
    imageUrl:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 203,
    isSaved: false,
    isFeatured: true,
    isPremium: true,
    minMonths: 10,
    maxMonths: undefined,
  },
  {
    id: '7',
    title: 'Yogurt Berry Parfait',
    description:
      'Layers of creamy yogurt, fresh berries, and crunchy granola. A nutritious treat kids love.',
    imageUrl:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 167,
    isSaved: true,
    isFeatured: false,
    isPremium: false,
    minMonths: 9,
    maxMonths: 48,
  },
  {
    id: '9',
    title: 'Avocado Toast Fingers',
    description:
      'Creamy avocado on whole grain toast cut into finger-friendly strips. Rich in healthy fats.',
    imageUrl:
      'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 178,
    isSaved: true,
    isFeatured: false,
    isPremium: false,
    minMonths: 7,
    maxMonths: 30,
  },
  {
    id: '10',
    title: 'Turkey & Veggie Meatballs',
    description:
      'Soft, tender meatballs made with ground turkey and finely chopped vegetables.',
    imageUrl:
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 267,
    isSaved: false,
    isFeatured: true,
    isPremium: false,
    minMonths: 9,
    maxMonths: undefined,
  },
  {
    id: '11',
    title: 'Pumpkin Puree Smoothie',
    description:
      'Creamy smoothie with pumpkin, banana, and yogurt. Perfect for fall and packed with vitamins.',
    imageUrl:
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop',
    rating: 4.1,
    reviewCount: 89,
    isSaved: false,
    isFeatured: false,
    isPremium: true,
    minMonths: 8,
    maxMonths: 24,
  },
  {
    id: '12',
    title: 'Soft Scrambled Eggs',
    description:
      'Ultra-soft scrambled eggs cooked to perfection. A protein-rich breakfast option for growing toddlers.',
    imageUrl:
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 145,
    isSaved: true,
    isFeatured: false,
    isPremium: false,
    minMonths: 6,
    maxMonths: 36,
  },
  {
    id: '13',
    title: 'Cucumber Sandwiches',
    description:
      'Light and refreshing cucumber sandwiches with cream cheese. Perfect for hot summer days.',
    imageUrl:
      'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop',
    rating: 3.9,
    reviewCount: 76,
    isSaved: false,
    isFeatured: false,
    isPremium: false,
    minMonths: 12,
    maxMonths: 48,
  },
  {
    id: '14',
    title: 'Baked Cauliflower Tots',
    description:
      'Crispy baked cauliflower tots seasoned with herbs. A healthier alternative to tater tots.',
    imageUrl:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 198,
    isSaved: true,
    isFeatured: false,
    isPremium: true,
    minMonths: 10,
    maxMonths: 42,
  },
  {
    id: '15',
    title: 'Homemade Fish Sticks',
    description:
      'Tender white fish coated in breadcrumbs and baked until golden. Much healthier than store-bought.',
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 223,
    isSaved: false,
    isFeatured: false,
    isPremium: false,
    minMonths: 8,
    maxMonths: undefined,
  },
  {
    id: '16',
    title: 'Strawberry Frozen Yogurt Bites',
    description:
      'Frozen yogurt bites with real strawberry pieces. A cool, healthy treat for warm days.',
    imageUrl:
      'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 112,
    isSaved: true,
    isFeatured: false,
    isPremium: true,
    minMonths: 6,
    maxMonths: 30,
  },
  {
    id: '17',
    title: 'Mini Pita Pizzas',
    description:
      'Individual pita bread pizzas with tomato sauce and cheese. Let toddlers help with toppings!',
    imageUrl:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 187,
    isSaved: false,
    isFeatured: false,
    isPremium: false,
    minMonths: 11,
    maxMonths: 36,
  },
  {
    id: '18',
    title: 'Carrot & Hummus Cups',
    description:
      'Fresh carrot sticks served with creamy homemade hummus. A nutritious snack that builds healthy habits.',
    imageUrl:
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    rating: 4.0,
    reviewCount: 94,
    isSaved: true,
    isFeatured: false,
    isPremium: false,
    minMonths: 9,
    maxMonths: undefined,
  },
  {
    id: '19',
    title: 'Banana Bread Muffins',
    description:
      'Moist banana muffins made with whole wheat flour and minimal sugar. Perfect for breakfast or snacks.',
    imageUrl:
      'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 156,
    isSaved: false,
    isFeatured: false,
    isPremium: true,
    minMonths: 7,
    maxMonths: 24,
  },
  {
    id: '20',
    title: 'Spinach & Cheese Pinwheels',
    description:
      'Colorful pinwheel sandwiches with cream cheese and spinach. A fun way to sneak in greens!',
    imageUrl:
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    rating: 4.2,
    reviewCount: 128,
    isSaved: true,
    isFeatured: false,
    isPremium: false,
    minMonths: 10,
    maxMonths: 48,
  },
];
