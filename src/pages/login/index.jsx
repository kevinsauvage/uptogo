import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import useForm from '../../hooks/useForm';
import Page from '../../layout/Page/Page';
import styles from './login.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import apiHelper from '../../helpers/apiHelper';
import { addUser } from '../../store/user/action';
import { setItem } from '../../helpers/localStorage';
import Loader from '../../components/Loader/Loader';

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (formData) => {
    const res = await apiHelper('/api/login', formData);

    if (res && res.success) {
      dispatch(addUser(res.user));
      setItem('user', res.user);

      const prevPath = window.sessionStorage.getItem('prevPath');

      if (prevPath === '/register' || !prevPath || prevPath === '/login')
        return router.push('/');

      return router.push(prevPath);
    }

    if (res && !res.success && res.name === 'notFound') {
      return toast.error('User not found. Create a account first', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }

    return toast.error('Oups, something went wrong, please try again.', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const { handleInputChange, handleSubmit, loading } = useForm(handleLogin);

  return (
    <Page title="Login">
      <form className={styles.form}>
        {loading && <Loader />}
        <h1 className={styles.title}>Login</h1>
        <Input
          type="email"
          id="email"
          label="Email"
          name="email"
          onChange={handleInputChange}
        />
        <Input
          type="password"
          id="password"
          label="Password"
          name="password"
          onChange={handleInputChange}
        />
        <div className={styles.login}>
          <p>
            Not registered yet ?{' '}
            <Link href="/register">
              <a>Register</a>
            </Link>
          </p>
        </div>
        <Button
          text="LOGIN"
          onClick={handleSubmit}
          style={styles.btn}
          onChange={handleInputChange}
        />
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Page>
  );
}

export default Login;

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
