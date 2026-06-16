import { useState } from "react";
import { Trophy, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        // AuthContext va detecta automat sesiunea nouă — App se va re-randa
      } else {
        const data = await signUpWithEmail(email, password);
        // Dacă Supabase cere confirmare email
        if (data.user && !data.session) {
          setSuccessMsg("Cont creat! Verifică-ți emailul pentru confirmare.");
        }
      }
    } catch (err) {
      setError(translateError(err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7A00FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FF87]/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-96 bg-[#00E5FF]/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FF87] to-[#7A00FF] flex items-center justify-center shadow-2xl shadow-[#00FF87]/20 mb-4">
            <Trophy size={28} className="text-black" />
          </div>
          <div className="text-white font-black text-2xl leading-none tracking-tight">WORLD CUP</div>
          <div className="text-[#00FF87] text-xs font-bold tracking-[0.25em] leading-none mt-1">2026 PREDICTOR</div>
          <p className="text-white/40 text-sm mt-3 text-center">
            {mode === "login" ? "Intră în cont pentru a-ți salva predicțiile" : "Creează-ți contul gratuit"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#111118] to-[#0A0A12] p-6 sm:p-8 shadow-2xl">
          {/* Mode toggle */}
          <div className="flex rounded-2xl bg-white/5 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); setSuccessMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === "login"
                  ? "bg-gradient-to-r from-[#7A00FF] to-[#00E5FF] text-white shadow-lg"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <LogIn size={14} />
              Intră în cont
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); setSuccessMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === "register"
                  ? "bg-gradient-to-r from-[#7A00FF] to-[#00E5FF] text-white shadow-lg"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <UserPlus size={14} />
              Cont nou
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Adresă email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplu@email.com"
                  className="w-full bg-[#1E1E2E] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7A00FF]/60 focus:ring-1 focus:ring-[#7A00FF]/20 transition-all"
                />
              </div>
            </div>

            {/* Parolă */}
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Parolă
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="auth-password"
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Minim 6 caractere" : "Parola ta"}
                  className="w-full bg-[#1E1E2E] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7A00FF]/60 focus:ring-1 focus:ring-[#7A00FF]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-[#FF004D]/10 border border-[#FF004D]/25 px-3.5 py-3">
                <AlertCircle size={15} className="text-[#FF004D] shrink-0 mt-0.5" />
                <p className="text-[#FF004D] text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div className="flex items-start gap-2.5 rounded-xl bg-[#00FF87]/8 border border-[#00FF87]/25 px-3.5 py-3">
                <CheckCircle2 size={15} className="text-[#00FF87] shrink-0 mt-0.5" />
                <p className="text-[#00FF87] text-xs leading-relaxed">{successMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#7A00FF] to-[#00E5FF] text-white font-bold text-sm shadow-lg shadow-[#7A00FF]/25 hover:shadow-[#7A00FF]/40 hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : mode === "login" ? (
                <LogIn size={16} />
              ) : (
                <UserPlus size={16} />
              )}
              {loading ? "Se procesează..." : mode === "login" ? "Intră în cont" : "Creează cont"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Datele tale sunt protejate · World Cup 2026 Predictor
        </p>
      </div>
    </div>
  );
}

// Traduce mesajele de eroare Supabase în română
function translateError(msg) {
  if (!msg) return "Eroare necunoscută. Încearcă din nou.";
  if (msg.includes("Invalid login credentials")) return "Email sau parolă incorectă. Încearcă din nou.";
  if (msg.includes("Email not confirmed")) return "Emailul nu a fost confirmat. Verifică-ți căsuța poștală.";
  if (msg.includes("User already registered")) return "Există deja un cont cu acest email. Încearcă să te conectezi.";
  if (msg.includes("Password should be at least")) return "Parola trebuie să aibă cel puțin 6 caractere.";
  if (msg.includes("Unable to validate email")) return "Adresa de email este invalidă.";
  if (msg.includes("signup is disabled")) return "Înregistrarea nu este activată momentan.";
  if (msg.includes("rate limit")) return "Prea multe încercări. Așteaptă câteva minute.";
  return msg;
}
