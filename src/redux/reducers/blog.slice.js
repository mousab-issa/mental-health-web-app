import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchData, { deleteData, postData, putData } from "../../helper/apiCall";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (page = 1) => {
    const response = await fetchData(`/blogs?page=${page}&limit=10`);
    return response.data;
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchById",
  async (blogId) => {
    const response = await fetchData(`/blogs/${blogId}`);
    return response.data;
  }
);

export const createBlog = createAsyncThunk("blogs/createBlog", async (blog) => {
  const response = await postData("/blogs", blog);
  return response.data;
});

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  const response = await deleteData(`/blogs/${id}`);
  return response.data;
});

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blog }) => {
    const response = await putData(`/blogs/${id}`, blog);
    return response.data;
  }
);

// Blog Slice
const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (blog) => blog._id !== action.payload._id
        );
        state.loading = false;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (blog) => blog._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (blog) => blog._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        } else {
          state.data.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default blogsSlice.reducer;
