import { Clock3, ShieldCheck, Star } from 'lucide-react';
import { masters, products } from '../data/mockData';
import { ServiceRequest } from '../types';

export default function RequestStatusCard({ request }: { request: ServiceRequest }) {
  const master = masters.find(item => item.id === request.assignedMasterId);
  return <article className={`request-status-card ${master ? 'assigned' : ''}`}>
    <div className="request-status-head"><div><span className="request-kicker">{request.source === 'cart' ? 'ЗАЯВКА ИЗ КОРЗИНЫ' : 'ПРЯМОЙ ВЫЗОВ'}</span><h3>{request.productIds.length ? request.productIds.map(id => products.find(product => product.id === id)?.name).filter(Boolean).join(', ') : request.description}</h3></div><span className={`request-state ${master ? 'assigned' : ''}`}>{master ? 'Мастер найден' : 'Ищем мастера'}</span></div>
    <p className="request-status-meta"><Clock3 size={16} /> {request.arrivalWindow}{request.deliveryWindow ? ` · доставка ${request.deliveryWindow}` : ''}</p>
    {master ? <div className="request-assigned-master"><span className="request-master-avatar">{master.avatar}</span><div><strong>{master.name}</strong><span>{master.specialization} · 8 лет опыта</span><small><Star size={14} fill="currentColor" /> {master.rating.toFixed(2)} <ShieldCheck size={14} /> Проверен ОМА PRO</small></div></div> : <p className="request-waiting">Заявка видна мастерам на карте. Карточка специалиста появится здесь после принятия.</p>}
  </article>;
}
