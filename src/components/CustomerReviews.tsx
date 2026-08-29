import { useState, FormEvent } from 'react';
import { Star, MessageSquare, Plus, Check } from 'lucide-react';
import { Language, Review } from '../types';
import { GOOGLE_REVIEWS } from '../data';

interface CustomerReviewsProps {
  lang: Language;
}

export default function CustomerReviews({ lang }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(GOOGLE_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  
  // Custom review form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle post custom review
  const handlePostReview = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    const newReview: Review = {
      id: 'rev_' + Date.now(),
      name,
      rating,
      textFr: text,
      textEn: text,
      date: lang === 'fr' ? 'À l’instant' : 'Just now',
      isVerified: false // Real-time user input
    };

    setReviews(prev => [newReview, ...prev]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
      setName('');
      setText('');
      setRating(5);
    }, 2000);
  };

  return (
    <section id="avis-clients" className="py-12 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with score overview */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-neutral-900 dark:text-white tracking-tight animate-letter-spacing">
              {lang === 'fr' ? 'Ce que disent nos clients' : 'What Our Guests Say'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {lang === 'fr'
                ? 'Notre réputation est notre plus grand actif. Retrouvez des avis réels vérifiés.'
                : 'Our reputation is our greatest asset. Real verified feedback from our guests.'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="text-center border-r border-neutral-100 dark:border-neutral-900 pr-4">
              <span className="block text-3xl font-bold font-display text-neutral-950 dark:text-white leading-none">
                4.7
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 mt-1 block">
                Google Score
              </span>
            </div>
            <div>
              <div className="flex items-center text-amber-500 gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4.5 h-4.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-neutral-500 mt-1 block">
                79 {lang === 'fr' ? 'avis vérifiés' : 'verified reviews'}
              </span>
            </div>
          </div>
        </div>

        {/* Bento grid layout for reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {reviews.map((rev, idx) => (
            <div
              key={rev.id}
              className={`bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between min-h-[160px] ${
                idx === 0 ? 'md:col-span-1 animate-slide-in-left' : 'animate-slide-in-right'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                      <span>{rev.name}</span>
                      {rev.isVerified && (
                        <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.2 rounded-full font-mono font-bold">
                          {lang === 'fr' ? 'Vérifié' : 'Verified'}
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">{rev.date}</span>
                  </div>

                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                  "{lang === 'fr' ? rev.textFr : rev.textEn}"
                </p>
              </div>

              <div className="mt-3 text-[10px] text-neutral-400 font-mono flex items-center gap-1.5 pt-2 border-t border-neutral-50 dark:border-neutral-900">
                <MessageSquare className="w-3.5 h-3.5 text-neutral-300" />
                <span>Google Business Profile Integration</span>
              </div>
            </div>
          ))}

        </div>

        {/* CTA to write a review */}
        <div className="mt-8 text-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 border border-blue-600 dark:border-blue-500 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-full text-blue-600 dark:text-blue-400 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Laisser un avis client' : 'Write a Review'}</span>
            </button>
          ) : (
            // CUSTOM REVIEW SUBMISSION FORM
            <div className="max-w-xl mx-auto bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl text-left shadow-lg animate-fade-in">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                {lang === 'fr' ? 'Exprimez votre avis' : 'Submit Your Feedback'}
              </h3>

              {success ? (
                <div className="py-6 text-center space-y-2 animate-scale-up">
                  <Check className="w-12 h-12 text-green-500 mx-auto bg-green-500/10 p-2.5 rounded-full" />
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    {lang === 'fr' ? 'Merci pour votre note chaleureuse ! 💖' : 'Thank you for your rating! 💖'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePostReview} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 font-mono">
                      {lang === 'fr' ? 'Votre Nom' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Alice Bernard"
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 font-mono">
                      {lang === 'fr' ? 'Votre Note (Étoiles)' : 'Your Rating'}
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 font-mono">
                      {lang === 'fr' ? 'Commentaire' : 'Review Text'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={lang === 'fr' ? 'Partagez votre expérience gastronomique chez nous...' : 'Share your culinary experience with us...'}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="w-2/3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      {lang === 'fr' ? 'Publier mon avis' : 'Publish Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-1/3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {lang === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
