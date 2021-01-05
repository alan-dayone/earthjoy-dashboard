import React, {FC, useEffect} from 'react';
import {everyone} from '../hocs/everyone';
import {useRouter} from 'next/router';

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

export default everyone(IndexPage);
