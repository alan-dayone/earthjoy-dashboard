import React, {FC} from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const InputFilter: FC<Props> = ({value, onChange}: Props) => (
  <input
    className="form-control form-control-sm"
    value={value}
    onChange={(e): void => onChange(e.target.value || '')}
    placeholder="Search..."
  />
);
