import React, {FC, useEffect} from 'react';
import {useRouter} from 'next/router';
import {adminOnly} from '../hocs/adminOnly';

const IndexPage: FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('admin/login');
  }, []);
  return (
    <div className="container">
      <h1>Redirecting ...</h1>
    </div>
  );
};

export default adminOnly(IndexPage);
