import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const InputFilter: FC<Props> = ({value, onChange}: Props) => {
  const {t} = useTranslation();
  return (
    <input
      className="form-control form-control-sm"
      value={value || ''}
      onChange={(e): void => onChange(e.target.value || '')}
      placeholder={t('search')}
    />
  );
};
