<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {loginSchema, registerSchema} from '@/plugins/joi';

const username: Ref<string> = ref('');
const email: Ref<string> = ref('');
const userNotFound = ref(false);
const errorMessage = ref(''); 

const router = useRouter();
const authStore = useAuthStore();
// Function to handle login
const submit = async () => {
  // Validate the username using your schema
  const { error } = loginSchema.validate({ username: username.value });
  if (error) {
    errorMessage.value = error.message;
    return;
  }

  // Reset the error message and userNotFound state
  errorMessage.value = '';
  userNotFound.value = false;

  try {
    // Attempt to log in the user
    const res = await authStore.login(username.value);
    // If the user is found, redirect to the home page
    if (res.status === 200) {
      router.push('/');
    } 
    // If the user is not found (404), show an appropriate message
    else {
      errorMessage.value = 'User not found. Please register below.';
      userNotFound.value = true;  // Set `userNotFound` to false if user is not found
    }
  } catch (error) {
    // If an unexpected error occurs, show a general error message
    errorMessage.value = 'An error occurred during login.';
    userNotFound.value = false;
  }
};

// Function to handle registration
const register = async () => {
    const { error } = registerSchema.validate({ username: username.value, email: email.value });
        if (error) {
            errorMessage.value = error.message;
            return;
        }
  errorMessage.value = ''; // Reset error message before registration attempt
  try {
    const res = await authStore.register(username.value, email.value);
    if (res.status === 201 || res.status === 200) {
      router.push('/');
    } else {
      errorMessage.value = res instanceof Error ? res.message : 'Registration failed.';
    }
  } catch (error) {
    console.error('Registration error:', error);
    errorMessage.value = 'An error occurred during registration.';
  }
};
</script>

<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="auto">
          <h1>Login</h1>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col v-if="!userNotFound" cols="8" md="3">
          <!-- Login Form -->
          <v-form @submit.prevent="submit">
            <!-- Dynamic class binding for error styles -->
            <v-text-field
              v-model="username"
              :class="{'error-border': errorMessage}" 
              label="Username"
              required
            ></v-text-field>
            <v-btn type="submit">Login</v-btn>
          </v-form>
        </v-col>
        <v-col v-else cols="8" md="3">
          <!-- Registration Form -->
          <v-form @submit.prevent="register">
            <!-- Dynamic class binding for error styles -->
            <v-text-field
              v-model="username"
              :class="{'error-border': errorMessage}"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              :class="{'error-border': errorMessage}"
              label="Email"
              type="email"
              required
            ></v-text-field>
            <v-btn type="submit" class="text-white bg-primary">Register</v-btn>
          </v-form>
        </v-col>
      </v-row>
      
      <!-- Error Message Display -->
      <v-row justify="center" v-if="errorMessage">
        <v-col cols="8" md="3">
          <p class="error-message">{{ errorMessage }}</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
</style>