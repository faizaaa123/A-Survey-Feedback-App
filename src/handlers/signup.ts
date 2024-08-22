import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  email: string;
  role: number;
  key: string;
  password: string;
  password_confirmation: string;
}

const useSignup = () => {
  const router = useRouter();
  const [disable, setDisable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const onSignUp = async (
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>
  ) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      setDisable(true);
      if (user.password !== user.password_confirmation) {
        setError('Password does not match');
        setUser({ ...user, password: '', password_confirmation: '' });
        setDisable(false);
        return;
      }
      const response = await axios.post(`/api/users/signup`, {
        username: user.username,
        email: user.email,
        role: user.role,
        key: user.key,
        password: user.password,
      });
      console.log('Signup success');
      setSuccess(response.data?.message);
      router.push('/login');
    } catch (error: any) {
      console.log(
        'Signup failed',
        error?.response?.data?.error?.message || error.message
      );
      setError(error?.response?.data?.error?.message || 'An error occurred');
      setDisable(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    disable,
    isSignupLoading: loading,
    isSignupError: error,
    isSignupSuccess: success,
    onSignUp,
  };
};

export default useSignup;
