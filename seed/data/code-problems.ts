import apiService from '../services/api-service';
import { ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher@example.com',
      password: '12345aB@',
    });
    console.log('Teacher sign in successful');

    


    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Teacher sign out successful');


  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
