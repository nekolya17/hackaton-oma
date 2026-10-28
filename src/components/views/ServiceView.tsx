import { useState } from 'react';
import { ArrowRight, ClipboardList, MapPin, ShoppingCart, Star, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RequestStatusCard from '../RequestStatusCard';
import { masters } from '../../data/mockData';

const workOptions = [
  'Установить смеситель',
  'Повесить люстру',
  'Установить карниз',
  'Собрать мебель',
  'Подключить бытовую технику',
];
const districts = [
  { name: 'Новая Боровая', coordinates: [53.9540, 27.6700] as [number, number] },
  { name: 'Минск-Мир', coordinates: [53.8720, 27.5500] as [number, number] },
  { name: 'Уручье', coordinates: [53.9450, 27.6900] as [number, number] },
];

export default function ServiceView() {
  const { createServiceRequest, serviceRequests, setActiveTab } = useApp();
  const [workType, setWorkType] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(districts[0].name);
  const [address, setAddress] = useState('');
  const [arrivalWindow, setArrivalWindow] = useState('Сегодня, 18:00–20:00');
  const directRequests = serviceRequests.filter(request => request.source === 'direct');
  const latestRequest = directRequests[0];
  const assignedMaster = masters.find(master => master.id === latestRequest?.assignedMasterId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const task = [workType, description.trim()].filter(Boolean).join(' — ');
    if (!task || !address.trim()) return;
    const location = districts.find(item => item.name === district) ?? districts[0];
    createServiceRequest({
      source: 'direct',
      description: task,
      productIds: [],
      arrivalWindow,
      address: address.trim(),
      district,
      coordinates: location.coordinates,
      estimatedPrice: 35,
    });
    setWorkType('');
    setDescription('');
  };

  return <div className="view-content service-view">
    <div className="service-paths"><div className="service-path active"><span><Wrench size={23} /></span><div><small>ВАРИАНТ 01</small><h2>Вызвать мастера</h2><p>Опишите задачу своими словами или выберите работу из списка.</p></div></div><button type="button" className="service-path" onClick={() => setActiveTab('customer')}><span><ShoppingCart size={23} /></span><div><small>ВАРИАНТ 02</small><h2>Мастер для товара из корзины</h2><p>Отметьте товар в корзине. Время визита подстроится под доставку.</p></div><ArrowRight size={20} /></button></div>
    <div className="service-form-layout"><section className="service-form-panel"><div className="service-form-title"><ClipboardList size={22} /><div><h2>Расскажите, что нужно сделать</h2><p>Заявку увидят мастера. Вы получите карточку специалиста после принятия.</p></div></div><form onSubmit={handleSubmit} className="service-request-form">
      <label>Выберите работу из списка <span>необязательно</span><select value={workType} onChange={event => setWorkType(event.target.value)}><option value="">Выбрать работу</option>{workOptions.map(option => <option key={option} value={option}>{option}</option>)}</select></label>
      <label>Или опишите задачу <span>можно добавить детали к выбранной работе</span><textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Например: нужно повесить полку на бетонную стену" rows={4} /></label>
      <div className="service-form-row"><label>Район<select value={district} onChange={event => setDistrict(event.target.value)}>{districts.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label><label>Адрес<input value={address} onChange={event => setAddress(event.target.value)} placeholder="Улица, дом, квартира" required /></label></div>
      <label>Когда удобно принять мастера<select value={arrivalWindow} onChange={event => setArrivalWindow(event.target.value)}><option>Сегодня, 18:00–20:00</option><option>Завтра, 10:00–12:00</option><option>Завтра, 18:00–20:00</option></select></label>
      <button type="submit" className="checkout-button" disabled={!workType && !description.trim()}>Отправить заявку <ArrowRight size={18} /></button>
    </form></section><aside className="service-help-card" aria-live="polite"><MapPin size={25} />
      {latestRequest ? <>
        <h3>{assignedMaster ? 'Мастер принял заявку' : 'Заявка отправлена'}</h3>
        <p className="service-preview-task">{latestRequest.description}</p>
        <p>{latestRequest.address} · {latestRequest.arrivalWindow}</p>
        {assignedMaster ? <div className="service-preview-master"><span className="request-master-avatar">{assignedMaster.avatar}</span><div><strong>{assignedMaster.name}</strong><small>{assignedMaster.specialization}</small><small><Star size={14} fill="currentColor" /> {assignedMaster.rating.toFixed(2)} · Проверен ОМА PRO</small></div></div> : <span>Ищем мастера. Заявка уже видна в его кабинете.</span>}
      </> : <><h3>Мастер откликнется на заявку</h3><p>Отправьте заявку. Здесь появится её статус, а после принятия — имя, рейтинг и специализация мастера.</p><span>Предварительная стоимость услуги — от 35 BYN</span></>}
    </aside></div>
    {directRequests.length > 1 && <section className="request-history" aria-live="polite"><h2>Предыдущие заявки</h2><div className="request-history-list">{directRequests.slice(1).map(request => <RequestStatusCard key={request.id} request={request} />)}</div></section>}
  </div>;
}
