import nissanTerraImg from '../assets/images/fleet_nissan_terra_suv_1793637197715.jpg';
import skodaKaroqImg from '../assets/images/fleet_skoda_karoq_crossover_1793637070232.jpg';
import audiA3Img from '../assets/images/fleet_audi_a3_sedan_1793637071907.jpg';
import vwJettaGliImg from '../assets/images/fleet_vw_jetta_gli_1793637073627.jpg';
import audiRs5Img from '../assets/images/fleet_audi_rs5_sportback_1793637073983.jpg';

export const FLEET_IMAGES: Record<string, string> = {
  'nissan-terra-2020': nissanTerraImg,
  'skoda-karoq-2019': skodaKaroqImg,
  'audi-a3-2021': audiA3Img,
  'vw-jetta-gli': vwJettaGliImg,
  'audi-rs5-2019': audiRs5Img,
};

export function getVehicleImage(vehicleId?: string): string {
  if (!vehicleId) return audiA3Img;
  if (FLEET_IMAGES[vehicleId]) return FLEET_IMAGES[vehicleId];

  const normalized = vehicleId.toLowerCase();
  if (normalized.includes('terra') || normalized.includes('nissan')) return nissanTerraImg;
  if (normalized.includes('karoq') || normalized.includes('skoda')) return skodaKaroqImg;
  if (normalized.includes('rs5')) return audiRs5Img;
  if (normalized.includes('jetta') || normalized.includes('vw') || normalized.includes('volkswagen')) return vwJettaGliImg;
  return audiA3Img;
}
