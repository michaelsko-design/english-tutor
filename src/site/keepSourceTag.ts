/**
 * The landing page's only script. A family that opens `/home/?src=ad&c=…` (an ad, a shared link, a
 * QR code) keeps that tag: it is stored the same way the app stores it, and the first tag wins, so
 * the page's own `?src=landing` link into the app does not replace it.
 */
import { captureAttribution } from '../data/attribution';

captureAttribution(window.location.search);
