import { ArrowRight, HardHat, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RoleSelect() {
  const { selectRole } = useApp();

  return (
    <main className="role-gate">
      <div className="role-gate-inner">
        <div className="role-gate-brand">
          <img src="/oma-logo.png" alt="ОМА" />
          <span aria-hidden="true" />
          <strong>МАСТЕРА</strong>
        </div>

        <div className="role-gate-heading">
          <h1>Логин</h1>
        </div>

        <div className="role-options" aria-label="Выбор роли">
          <button type="button" className="role-option role-option-customer" onClick={() => selectRole('customer')}>
            <span className="role-option-icon"><ShoppingCart size={29} /></span>
            <strong>Войти как клиент</strong>
            <ArrowRight className="role-option-arrow" size={21} />
          </button>

          <button type="button" className="role-option role-option-master" onClick={() => selectRole('master')}>
            <span className="role-option-icon"><HardHat size={29} /></span>
            <strong>Войти как мастер</strong>
            <ArrowRight className="role-option-arrow" size={21} />
          </button>
        </div>
      </div>
    </main>
  );
}
