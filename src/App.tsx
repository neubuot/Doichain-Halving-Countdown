import { useEffect, useState } from 'react';
import { Clock, TrendingUp, Coins, Activity } from 'lucide-react';

const HALVING_INTERVAL = 210000;
const INITIAL_REWARD = 50;
const AVERAGE_BLOCK_TIME = 600;

interface BlockchainData {
  currentBlock: number;
  difficulty: number;
  hashrate: number;
}

function App() {
  const [blockData, setBlockData] = useState<BlockchainData | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [adjustForHashrate, setAdjustForHashrate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doichain-proxy`;

        const blockResponse = await fetch(`${apiUrl}?q=getblockcount`);
        const currentBlock = await blockResponse.text();

        const diffResponse = await fetch(`${apiUrl}?q=getdifficulty`);
        const difficulty = await diffResponse.text();

        const hashrateResponse = await fetch(`${apiUrl}?q=hashrate`);
        const hashrate = await hashrateResponse.text();

        setBlockData({
          currentBlock: Number(currentBlock),
          difficulty: Number(difficulty),
          hashrate: Number(hashrate)
        });
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden der Blockchain-Daten:', err);
        setError('Fehler beim Laden der Blockchain-Daten');
        setLoading(false);
      }
    };

    fetchBlockData();
    const interval = setInterval(fetchBlockData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!blockData) return;

    const calculateCountdown = () => {
      const currentHalvingEpoch = Math.floor(blockData.currentBlock / HALVING_INTERVAL);
      const nextHalvingBlock = (currentHalvingEpoch + 1) * HALVING_INTERVAL;
      const blocksRemaining = nextHalvingBlock - blockData.currentBlock;

      let secondsRemaining = blocksRemaining * AVERAGE_BLOCK_TIME;

      if (adjustForHashrate) {
        secondsRemaining *= 0.95;
      }

      const days = Math.floor(secondsRemaining / 86400);
      const hours = Math.floor((secondsRemaining % 86400) / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = Math.floor(secondsRemaining % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [blockData, adjustForHashrate]);

  const getCurrentReward = () => {
    if (!blockData) return INITIAL_REWARD;
    const halvings = Math.floor(blockData.currentBlock / HALVING_INTERVAL);
    return INITIAL_REWARD / Math.pow(2, halvings);
  };

  const getNextReward = () => {
    return getCurrentReward() / 2;
  };

  const getNextHalvingBlock = () => {
    if (!blockData) return HALVING_INTERVAL;
    const currentHalvingEpoch = Math.floor(blockData.currentBlock / HALVING_INTERVAL);
    return (currentHalvingEpoch + 1) * HALVING_INTERVAL;
  };

  const getBlocksRemaining = () => {
    if (!blockData) return HALVING_INTERVAL;
    return getNextHalvingBlock() - blockData.currentBlock;
  };

  const getEstimatedDate = () => {
    if (!blockData) return new Date();
    const blocksRemaining = getBlocksRemaining();
    let secondsRemaining = blocksRemaining * AVERAGE_BLOCK_TIME;

    if (adjustForHashrate) {
      secondsRemaining *= 0.95;
    }

    return new Date(Date.now() + secondsRemaining * 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Doichain-Daten...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Doichain Halving Countdown
          </h1>
          <p className="text-xl text-gray-300">
            Countdown bis zum nächsten Block-Reward Halving
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-6xl font-bold text-cyan-400">{countdown.days}</div>
            <div className="text-gray-300 mt-2">Tage</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-6xl font-bold text-cyan-400">{countdown.hours}</div>
            <div className="text-gray-300 mt-2">Stunden</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-6xl font-bold text-cyan-400">{countdown.minutes}</div>
            <div className="text-gray-300 mt-2">Minuten</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div className="text-6xl font-bold text-cyan-400">{countdown.seconds}</div>
            <div className="text-gray-300 mt-2">Sekunden</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">Voraussichtliches Datum</span>
                </div>
                <div className="text-2xl font-bold">
                  {getEstimatedDate().toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hashrate"
                  checked={adjustForHashrate}
                  onChange={(e) => setAdjustForHashrate(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <label htmlFor="hashrate" className="text-gray-300 cursor-pointer">
                  Für steigende Hashrate anpassen
                </label>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-cyan-400" />
                <span className="text-xl font-semibold">Block-Reward</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-gray-300 text-sm">Aktuell</div>
                  <div className="text-3xl font-bold text-cyan-400">{getCurrentReward()} DOI</div>
                </div>
                <div>
                  <div className="text-gray-300 text-sm">Nach dem Halving</div>
                  <div className="text-3xl font-bold text-blue-400">{getNextReward()} DOI</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="text-xl font-semibold">Blockchain-Status</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-gray-300 text-sm">Aktueller Block</div>
                  <div className="text-2xl font-bold">{blockData?.currentBlock.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-300 text-sm">Blocks bis Halving</div>
                  <div className="text-2xl font-bold text-cyan-400">{getBlocksRemaining().toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-300 text-sm">Halving-Block</div>
                  <div className="text-2xl font-bold">{getNextHalvingBlock().toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="text-xl font-semibold">Netzwerk-Informationen</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-300 text-sm">Difficulty</div>
                <div className="text-xl font-bold">{blockData?.difficulty.toFixed(6)}</div>
              </div>
              <div>
                <div className="text-gray-300 text-sm">Hashrate</div>
                <div className="text-xl font-bold">{blockData?.hashrate.toFixed(2)} MH/s</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6">Was ist das Doichain Halving?</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Das Doichain Halving ist ein vorprogrammiertes Ereignis, das alle {HALVING_INTERVAL.toLocaleString()} Blöcke stattfindet.
              Dabei wird die Belohnung, die Miner für das Erstellen eines neuen Blocks erhalten, halbiert.
            </p>
            <p>
              Dieser Mechanismus ist ein fundamentaler Bestandteil der Geldpolitik von Doichain und sorgt dafür,
              dass die maximale Anzahl an Coins nie überschritten wird. Mit jedem Halving verlangsamt sich
              die Rate, mit der neue Doicoins in Umlauf gebracht werden.
            </p>
            <p>
              Das nächste Halving wird die Block-Reward von <span className="font-bold text-cyan-400">{getCurrentReward()} DOI</span> auf{' '}
              <span className="font-bold text-blue-400">{getNextReward()} DOI</span> reduzieren.
            </p>
            <p className="text-sm text-gray-400 mt-6">
              Hinweis: Das genaue Datum des Halvings kann variieren, da die Blockzeit nicht konstant ist.
              Die Schätzung basiert auf einer durchschnittlichen Blockzeit von {AVERAGE_BLOCK_TIME / 60} Minuten.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Dies ist ein Open-Source-Projekt unter MIT-Lizenz.
              Der Quellcode wird demnächst auf GitHub veröffentlicht.
            </p>
            <p className="text-gray-500 text-sm">
              Copyright © 2026 Ottmar Neuburger
            </p>
            <p className="text-gray-500 text-xs">
              Haftungsausschluss: Alle Angaben ohne Gewähr. Die bereitgestellten Informationen dienen ausschließlich
              zu Informationszwecken und stellen keine Anlageberatung dar. Für die Richtigkeit, Vollständigkeit und
              Aktualität der Daten wird keine Haftung übernommen.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
