import apiService from '../../services/api-service';
import { ResourcePrefix, EffectType } from '@datn242/questify-common';

const api = apiService.instance;

/**
 * Seed item templates
 * - Signs in as admin
 * - Creates various item templates with different effects
 */
const itemTemplates = [
  {
    gold: 50,
    name: 'Double XP Tome',
    effect: EffectType.ExpX2,
    effect_description: 'Experience Gain\n×2',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fexp_2.png?alt=media&token=5eef2e36-f691-4797-b99d-9d6f04d038a2',
    description:
      'A mystical green tome that doubles your bonus experience gain for the next lesson.',
  },
  {
    gold: 100,
    name: 'Triple XP Spellbook',
    effect: EffectType.ExpX3,
    effect_description: 'Experience Gain\n×3',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fexp_3.png?alt=media&token=154cfc84-7bba-43da-a5ff-2f33eff878e4',
    description:
      'An ancient green spellbook that triples your bonus experience gain for the next lesson.',
  },
  {
    gold: 150,
    name: 'Quadruple XP Grimoire',
    effect: EffectType.ExpX4,
    effect_description: 'Experience Gain\n×4',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fexp_4.png?alt=media&token=2e1648d8-e0b8-4992-bff0-0f45ce9468aa',
    description:
      'A powerful green grimoire that quadruples your bonus experience gain for the next lesson.',
  },
  {
    gold: 75,
    name: 'Mystery XP Lens',
    effect: EffectType.ExpRandom,
    effect_description: 'Experience Gain\n1-5×',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description:
      'A mysterious magical lens that gives a random XP multiplier (between 1× and 5×) for the next lesson.',
  },
  {
    gold: 60,
    name: 'Gem Doubler Wand',
    effect: EffectType.GoldX2,
    effect_description: 'Bonus Gem Gain\n×2',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fgem_2.png?alt=media&token=2d8afbf5-f333-4d40-b495-91d308c90c1a',
    description: 'A magical green wand that doubles your bonus gem gain for the next lesson.',
  },
  {
    gold: 120,
    name: 'Gem Tripler Tome',
    effect: EffectType.GoldX3,
    effect_description: 'Bonus Gem Gain\n×3',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fgem_3.png?alt=media&token=e68d0f60-1ad0-45db-807c-ac79364e4f0d',
    description:
      'An ancient tome with red gemstones that triples your bonus gem gain for the next lesson.',
  },
  {
    gold: 180,
    name: 'Gem Quadrupler Ring',
    effect: EffectType.GoldX4,
    effect_description: 'Bonus Gem Gain\n×4',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fgem_4.png?alt=media&token=edfa5d29-9cb8-4b99-a0ec-3d43c90179bb',
    description:
      'A powerful ring with multiple gemstones that quadruples your bonus gem gain for the next lesson.',
  },
  {
    gold: 90,
    name: 'Lucky Gem Bracelet',
    effect: EffectType.GoldRandom,
    effect_description: 'Gem Gain\n1-5×',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fgem_random.png?alt=media&token=4d413d8f-9f28-4b5c-87ab-571ff401b562',
    description:
      'A mysterious enchanted bracelet with a turquoise stone that gives a random bonus gem multiplier (between 1× and 5×) for the next lesson.',
  },
];

async function seedItemTemplates() {
  try {
    // Sign in as admin
    console.log('Signing in as admin...');
    try {
      await api.post(ResourcePrefix.Auth + '/signin', {
        email: 'admin@example.com',
        password: '12345aB@',
      });
      console.log('Sign in successful');
    } catch (signInError) {
      console.error('Sign in failed:', signInError.response?.data || signInError.message);
      return;
    }

    try {
      const currentUser = await api.get(ResourcePrefix.Auth + '/currentuser');
      console.log('Authenticated as:', currentUser.data.currentUser.email);
    } catch (authCheckError) {
      console.error(
        'Authentication check failed:',
        authCheckError.response?.data || authCheckError.message,
      );
      return;
    }

    console.log('Starting to seed item templates...');

    for (const item of itemTemplates) {
      try {
        const response = await api.post(ResourcePrefix.CourseManagement + '/item-templates', item);
        console.log(`Created item template: ${item.name} with ID: ${response.data.id}`);

        // Add a small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(
          `Error creating item template ${item.name}:`,
          error.response?.data || error.message,
        );
        if (error.response?.status === 404) {
          console.error(
            'Check if ResourcePrefix.ItemTemplateManagement is correct and the route is implemented',
          );
        }
      }
    }

    console.log('Item template seeding completed');

    // Sign out
    try {
      await api.post(ResourcePrefix.Auth + '/signout', {});
      console.log('Signed out successfully');
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError.response?.data || signOutError.message);
    }
  } catch (error) {
    console.error(
      'Unexpected error during seeding process:',
      error.response?.data || error.message,
    );
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedItemTemplates();
}

export default seedItemTemplates;
