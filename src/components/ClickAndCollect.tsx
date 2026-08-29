import { useState, useMemo, FormEvent } from 'react';
import { ShoppingBag, Trash2, Clock, X, ChevronRight, CheckCircle2, ShieldAlert, Award, FileText } from 'lucide-react';
import { CartItem, Language } from '../types';

interface ClickAndCollectProps {
  lang: Language;
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onClearCart: () => void;
  onRemoveItem: (id: string) => void;
}

export default function ClickAndCollect({ lang, cart, onUpdateQty, onClearCart, onRemoveItem }: ClickAndCollectProps) {
  const [isOpen, setIsPlaying] = useState(false); // drawer state
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  
  // Checkout form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupSlot, setPickupSlot] = useState('');
  
  // Payment simulations
  const [is3DSActive, setIs3DSActive] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [orderId, setOrderId] = useState('');

  // Strict Server Recalculation simulation log (Never Trust the Client, page 41)
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);

  // Time slots aligned with opening hours (12:00 - 14:30, 19:00 - 20:00, page 12)
  const timeSlots = [
    '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15',
    '19:00', '19:15', '19:30', '19:45', '20:00'
  ];

  // Calculate totals
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Handle proceed to checkout
  const handleGoToDetails = () => {
    if (cart.length === 0) return;
    setCheckoutStep('details');
  };

  // Securely simulate checkout initiation (Server recalculates amounts, page 41)
  const handleInitiatePayment = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !pickupSlot) return;

    setSecurityLogs([]);
    setPaymentError('');
    setCheckoutStep('payment');
    
    // Simulate server side recalculation (Never Trust the Client)
    const logs = [
      `[POST /api/create-checkout-session] Recalculating totals on server...`,
      `Verified: client requested price sum: ${subtotal.toFixed(2)}€`,
      `Database lookups for exact item prices: OK.`,
      `Stripe checkout session initialized successfully with SECURE price mapping.`,
      `Enforcing 3D Secure 2 (SCA/PSD2 compliance active)`
    ];
    setSecurityLogs(logs);
  };

  // 3D Secure / SCA Payment confirmation simulation (page 44)
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setPaymentError('');

    setTimeout(() => {
      // Prompt 3DS verification
      setIs3DSActive(true);
      setIsProcessing(false);
    }, 1500);
  };

  // Submit 3DS SMS code
  const handleSubmit3DS = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (smsCode === '1234' || smsCode === '') {
        // Success
        const genId = 'LPF-' + Math.floor(100000 + Math.random() * 900000);
        setOrderId(genId);
        setCheckoutStep('success');
        setIs3DSActive(false);
        onClearCart();
      } else {
        setPaymentError(lang === 'fr' ? 'Code 3D Secure invalide. Utilisez "1234" ou laissez vide.' : 'Invalid 3D Secure code. Use "1234" or leave empty.');
      }
      setIsProcessing(false);
    }, 1500);
  };

  // Reset checkout flow
  const handleClose = () => {
    setIsPlaying(false);
    setCheckoutStep('cart');
    setIs3DSActive(false);
    setSmsCode('');
    setPaymentError('');
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsPlaying(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer border border-blue-500/20 group"
        aria-label="Open Click & Collect Cart"
      >
        <ShoppingBag className="w-6 h-6" />
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -left-2 bg-amber-500 text-neutral-900 border-2 border-white dark:border-neutral-950 font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs animate-scale-up">
            {totalQuantity}
          </span>
        )}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-xs font-semibold pl-0 group-hover:pl-2">
          {lang === 'fr' ? 'Mon Panier' : 'My Cart'}
        </span>
      </button>

      {/* Cart Slider Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between">
              
              {/* Drawer Header */}
              <div className="px-5 py-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  {lang === 'fr' ? 'Click & Collect' : 'Direct Order'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg text-neutral-500 cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
                
                {/* Checkout Step: CART */}
                {checkoutStep === 'cart' && (
                  <div className="space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          {lang === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {lang === 'fr' ? 'Ajoutez de délicieux plats depuis l’ardoise !' : 'Add mouthwatering dishes from our menu!'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs text-neutral-500 pb-2 border-b border-neutral-100 dark:border-neutral-900">
                          <span>{lang === 'fr' ? 'Plat sélectionné' : 'Selected Dish'}</span>
                          <button
                            onClick={onClearCart}
                            className="text-red-500 hover:text-red-600 font-semibold cursor-pointer"
                          >
                            {lang === 'fr' ? 'Vider' : 'Clear all'}
                          </button>
                        </div>

                        <div className="space-y-3">
                          {cart.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                                  {lang === 'fr' ? item.menuItem.nameFr : item.menuItem.nameEn}
                                </h4>
                                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                                  {(item.menuItem.price * item.quantity).toFixed(2)} €
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onUpdateQty(item.id, -1)}
                                  className="w-6 h-6 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-xs font-mono font-bold w-4 text-center text-neutral-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQty(item.id, 1)}
                                  className="w-6 h-6 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-950 rounded-md text-red-500 ml-1 cursor-pointer"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Checkout Step: DETAILS */}
                {checkoutStep === 'details' && (
                  <form onSubmit={handleInitiatePayment} className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                      {lang === 'fr' ? 'Vos Coordonnées de Retrait' : 'Your Pickup Details'}
                    </h3>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {lang === 'fr' ? 'Nom complet' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Jean Dupont"
                        className="w-full px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {lang === 'fr' ? 'Adresse email' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean.dupont@email.com"
                        className="w-full px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {lang === 'fr' ? 'Numéro de téléphone' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{lang === 'fr' ? 'Créneau de retrait (Aujourd’hui)' : 'Pickup Slot (Today)'}</span>
                      </label>
                      <select
                        required
                        value={pickupSlot}
                        onChange={(e) => setPickupSlot(e.target.value)}
                        className="w-full py-2 px-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="">-- {lang === 'fr' ? 'Choisir une heure' : 'Select a time'} --</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        {lang === 'fr' 
                          ? '* Heures alignées sur l’ouverture de notre cuisine. Dernier retrait : 20h00.' 
                          : '* Hours aligned with our kitchen services. Last pickup: 8:00 PM.'}
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>{lang === 'fr' ? 'Passer au paiement sécurisé' : 'Proceed to Secure Payment'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Checkout Step: PAYMENT */}
                {checkoutStep === 'payment' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed flex gap-2">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <div>
                        <span className="font-bold">{lang === 'fr' ? 'Démonstration de Sécurité :' : 'Security Demonstration:'}</span>{' '}
                        {lang === 'fr'
                          ? 'Le montant est recalculé côté serveur d’après la base de données. Il est impossible de pirater ou d’altérer les prix stockés dans votre panier.'
                          : 'The payment amount is securely recalculated on our servers. Manipulating local storage prices will have zero effect.'}
                      </div>
                    </div>

                    {/* Console simulation log */}
                    <div className="bg-neutral-950 rounded-lg p-3 font-mono text-[9px] text-green-400 space-y-1 select-none overflow-x-auto shadow-inner leading-relaxed">
                      <div className="text-neutral-500 pb-1 border-b border-neutral-900 mb-1">
                        &gt;_ SERVER RECALCULATION METADATA
                      </div>
                      {securityLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>

                    {/* Simple Credit Card Entry Form */}
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3 bg-white dark:bg-neutral-950 shadow-inner">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-900">
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                          {lang === 'fr' ? 'Carte Bancaire (Simulé)' : 'Credit Card (Simulated)'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">
                          Stripe Gateway
                        </span>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="4242 •••• •••• 4242"
                          disabled
                          className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-mono"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            disabled
                            className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-mono"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            disabled
                            className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {paymentError && (
                      <p className="text-xs font-semibold text-red-500 text-center">{paymentError}</p>
                    )}

                    {!is3DSActive ? (
                      <button
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{lang === 'fr' ? 'Traitement Stripe...' : 'Processing Stripe...'}</span>
                          </>
                        ) : (
                          <span>
                            {lang === 'fr' 
                              ? `Payer ${subtotal.toFixed(2)} €` 
                              : `Pay ${subtotal.toFixed(2)} €`}
                          </span>
                        )}
                      </button>
                    ) : (
                      // 3D SECURE MODAL INLINE (SCA/PSD2 compliance)
                      <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                          <Award className="w-4 h-4" />
                          <span>3D Secure Verification (SCA)</span>
                        </div>
                        <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {lang === 'fr'
                            ? 'Simulez l’authentification forte de votre banque. Saisissez le code de validation reçu par SMS : "1234"'
                            : 'Simulate strong bank authentication. Enter the SMS code sent to your phone: "1234"'}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            placeholder="e.g., 1234"
                            className="w-1/2 px-3 py-1.5 border border-blue-300 dark:border-blue-700 rounded-lg text-xs font-mono text-center focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleSubmit3DS}
                            disabled={isProcessing}
                            className="w-1/2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                          >
                            {isProcessing ? '...' : (lang === 'fr' ? 'Valider' : 'Confirm')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Checkout Step: SUCCESS */}
                {checkoutStep === 'success' && (
                  <div className="text-center py-6 space-y-4 animate-fade-in">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                    
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {lang === 'fr' ? 'Paiement Validé ! 🎉' : 'Payment Confirmed! 🎉'}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {lang === 'fr'
                          ? `Votre commande est enregistrée sous le numéro :`
                          : `Your order has been registered as:`}
                      </p>
                      <p className="text-sm font-mono font-bold text-blue-600 mt-1 tracking-wider bg-blue-50 dark:bg-blue-950/20 py-1 px-3 inline-block rounded">
                        {orderId}
                      </p>
                    </div>

                    {/* Receipt Details */}
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50 dark:bg-neutral-900 text-left space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                        <FileText className="w-4 h-4 text-neutral-400" />
                        <span>{lang === 'fr' ? 'Ticket de Retrait' : 'Receipt Summary'}</span>
                      </div>
                      <div className="text-[11px] font-mono space-y-1 text-neutral-600 dark:text-neutral-400">
                        <div className="flex justify-between">
                          <span>{lang === 'fr' ? 'Client :' : 'Client:'}</span>
                          <span className="text-neutral-900 dark:text-white font-sans">{name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'fr' ? 'Téléphone :' : 'Phone:'}</span>
                          <span className="text-neutral-900 dark:text-white font-sans">{phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'fr' ? 'Heure de Retrait :' : 'Pickup Time:'}</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">{pickupSlot}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-1.5 mt-1">
                          <span>TOTAL :</span>
                          <span className="text-neutral-900 dark:text-white font-bold">{subtotal.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] leading-relaxed text-neutral-500">
                      {lang === 'fr'
                        ? '* Un email et un SMS de confirmation viennent d’être simulés vers vos coordonnées. Rendez-vous au 21 Rue Lazare Carnot à Clamart pour le retrait.'
                        : '* A confirmation email and SMS have been simulated to your details. Pick up your order at 21 Rue Lazare Carnot, Clamart.'}
                    </p>

                    <button
                      onClick={handleClose}
                      className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {lang === 'fr' ? 'Fermer' : 'Close'}
                    </button>
                  </div>
                )}

              </div>

              {/* Drawer Footer (Price total display & CTA) */}
              {cart.length > 0 && checkoutStep === 'cart' && (
                <div className="px-5 py-6 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-900 space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-neutral-700 dark:text-neutral-400">{lang === 'fr' ? 'Sous-total :' : 'Subtotal:'}</span>
                    <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                      {subtotal.toFixed(2)} €
                    </span>
                  </div>

                  <button
                    onClick={handleGoToDetails}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>{lang === 'fr' ? 'Renseigner mes informations' : 'Fill Pickup Details'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
