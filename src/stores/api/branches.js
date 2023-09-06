import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useBranch = defineStore('branch', () => {
  const $axios = inject('axios');

  function $init({
    id = undefined,
    name = undefined,
    address = undefined,
    description = undefined
  }) {
    return { id, name, address, description };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/branches', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/branches/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/branches', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
    try {
      return await $axios.put(`/branches/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/branches/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
