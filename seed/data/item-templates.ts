import apiService from '../services/api-service';
import { EffectType, ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    // Login as teacher who has permissions to create items
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher@example.com',
      password: '12345aB@',
    });
    console.log('Teacher login successful.');

    // Array of item templates to create
    const itemTemplates = [
      // XP Boost Items
      {
        name: 'Double XP Boost',
        effect: EffectType.ExpX2,
        effect_description: 'Experience Gain\n×2',
        description: 'Doubles your experience gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 50,
      },
      {
        name: 'Triple XP Boost',
        effect: EffectType.ExpX3,
        effect_description: 'Experience Gain\n×3',
        description: 'Triples your experience gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 100,
      },
      {
        name: 'Quadruple XP Boost',
        effect: EffectType.ExpX4,
        effect_description: 'Experience Gain\n×4',
        description: 'Quadruples your experience gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 150,
      },
      {
        name: 'Mystery XP Potion',
        effect: EffectType.ExpRandom,
        effect_description: 'Experience Gain\n1-5×',
        description: 'Gives a random XP multiplier (between 1× and 5×) for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 75,
      },
      
      // Gold Boost Items
      {
        name: 'Gold Doubler',
        effect: EffectType.GoldX2,
        effect_description: 'Gold Gain\n×2',
        description: 'Doubles your gold gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 60,
      },
      {
        name: 'Gold Tripler',
        effect: EffectType.GoldX3,
        effect_description: 'Gold Gain\n×3',
        description: 'Triples your gold gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 120,
      },
      {
        name: 'Gold Quadrupler',
        effect: EffectType.GoldX4,
        effect_description: 'Gold Gain\n×4',
        description: 'Quadruples your gold gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 180,
      },
      {
        name: 'Lucky Gold Chest',
        effect: EffectType.GoldRandom,
        effect_description: 'Gold Gain\n1-5×',
        description: 'Gives a random gold multiplier (between 1× and 5×) for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 90,
      },
    ];

    // First, get the list of existing item templates to avoid duplicates
    const existingItemsResponse = await api.get(ResourcePrefix.CourseManagement + '/item-templates');
    const existingItems = existingItemsResponse.data;
    const existingItemNames = existingItems.map(item => item.name);
    
    console.log(`Found ${existingItems.length} existing item templates.`);

    // Create each item template if it doesn't already exist
    for (const itemTemplate of itemTemplates) {
      if (existingItemNames.includes(itemTemplate.name)) {
        console.log(`Item Template '${itemTemplate.name}' already exists, skipping.`);
        continue;
      }
      
      try {
        const response = await api.post(ResourcePrefix.CourseManagement + '/item-templates', itemTemplate);
        console.log(`Item Template '${itemTemplate.name}' created successfully with ID: ${response.data.id}`);
      } catch (error) {
        console.error(`Error creating item template '${itemTemplate.name}':`, 
          error.response?.data || error.message);
      }
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('Item template seeding completed.');
    
    // Sign out after completing the seed process
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Teacher sign out successful');
    
  } catch (error) {
    console.error('Error seeding item templates:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
