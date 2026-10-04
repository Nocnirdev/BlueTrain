import { init } from './app';
import { initPwaUpdate } from './components/pwa-update';

// CSS imports — Vite los procesa y optimiza
import '../css/main.css';
import '../css/components.css';
import '../css/responsive.css';
import '../css/tracker.css';
import '../css/auth.css';

initPwaUpdate();
void init();
