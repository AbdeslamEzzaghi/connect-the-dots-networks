
import { create } from 'zustand';

export type Language = 'en' | 'fr';

type TranslationStore = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguageStore = create<TranslationStore>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));

export type TranslationKey = 
  | 'appTitle'
  | 'devices'
  | 'connections'
  | 'controls'
  | 'undo'
  | 'redo'
  | 'delete'
  | 'uploadFloorPlan'
  | 'resetFloorPlan'
  | 'saveNetwork'
  | 'loadNetwork'
  | 'clearAll'
  | 'wirelessRange'
  | 'meters'
  | 'deviceName'
  | 'cancel'
  | 'save'
  | 'selectDevice'
  | 'selectConnection'
  | 'deviceProperties'
  | 'noDeviceSelected'
  | 'isp'
  | 'accessPoint'
  | 'router'
  | 'switch'
  | 'repeater'
  | 'modem'
  | 'ont'
  | 'wallPhoneJack'
  | 'bus'
  | 'rj45'
  | 'rj11'
  | 'telephone'
  | 'fiber'
  | 'coaxial'
  | 'wireless'
  | 'ispDescription'
  | 'accessPointDescription'
  | 'routerDescription'
  | 'switchDescription'
  | 'repeaterDescription'
  | 'modemDescription'
  | 'ontDescription'
  | 'wallPhoneJackDescription'
  | 'busDescription'
  | 'rj45Description'
  | 'rj11Description'
  | 'telephoneDescription'
  | 'fiberDescription'
  | 'coaxialDescription'
  | 'wirelessDescription';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    appTitle: 'Network Builder',
    devices: 'Devices',
    connections: 'Connections',
    controls: 'Controls',
    undo: 'Undo',
    redo: 'Redo',
    delete: 'Delete',
    uploadFloorPlan: 'Upload Floor Plan',
    resetFloorPlan: 'Reset Floor Plan',
    saveNetwork: 'Save Network',
    loadNetwork: 'Load Network',
    clearAll: 'Clear All',
    wirelessRange: 'Wireless Range',
    meters: 'meters',
    deviceName: 'Device Name',
    cancel: 'Cancel',
    save: 'Save',
    selectDevice: 'Select a device',
    selectConnection: 'Select a connection',
    deviceProperties: 'Device Properties',
    noDeviceSelected: 'No device selected',
    isp: 'ISP',
    accessPoint: 'Access Point',
    router: 'Router',
    switch: 'Switch',
    repeater: 'Repeater',
    modem: 'Modem',
    ont: 'ONT',
    wallPhoneJack: 'Wall Phone Jack',
    bus: 'Bus',
    rj45: 'RJ45 (Ethernet)',
    rj11: 'RJ11 (Phone)',
    telephone: 'Telephone Cable',
    fiber: 'Fiber Optic',
    coaxial: 'Coaxial',
    wireless: 'Wireless',
    ispDescription: 'Internet Service Provider: The company that provides your internet connection',
    accessPointDescription: 'A device that creates a wireless network allowing devices to connect without cables',
    routerDescription: 'Connects multiple networks and routes network traffic between them',
    switchDescription: 'Connects multiple devices together on the same network',
    repeaterDescription: 'Extends the range of a wireless network by amplifying the signal',
    modemDescription: 'Converts digital data from your computer to analog signals for transmission over phone/cable lines',
    ontDescription: 'Optical Network Terminal: Converts fiber optic signals to electrical signals',
    wallPhoneJackDescription: 'Connection point for telephone services in walls',
    busDescription: 'A central pathway that connects multiple devices or terminals to a single communication channel',
    rj45Description: 'Standard connector for Ethernet networking cables (cat5, cat6)',
    rj11Description: 'Smaller connector used for telephone connections and DSL',
    telephoneDescription: 'Standard telephone wiring used to connect phone services',
    fiberDescription: 'Uses light pulses to transmit data at high speeds through thin glass fibers',
    coaxialDescription: 'Cable with a central conductor surrounded by insulation and a braided shield',
    wirelessDescription: 'Radio waves used to transmit data between devices without physical cables',
  },
  fr: {
    appTitle: 'Constructeur de Réseau',
    devices: 'Appareils',
    connections: 'Connexions',
    controls: 'Contrôles',
    undo: 'Annuler',
    redo: 'Rétablir',
    delete: 'Supprimer',
    uploadFloorPlan: 'Télécharger Plan',
    resetFloorPlan: 'Réinitialiser Plan',
    saveNetwork: 'Enregistrer Réseau',
    loadNetwork: 'Charger Réseau',
    clearAll: 'Tout Effacer',
    wirelessRange: 'Portée Sans Fil',
    meters: 'mètres',
    deviceName: 'Nom de l\'appareil',
    cancel: 'Annuler',
    save: 'Enregistrer',
    selectDevice: 'Sélectionner un appareil',
    selectConnection: 'Sélectionner une connexion',
    deviceProperties: 'Propriétés de l\'appareil',
    noDeviceSelected: 'Aucun appareil sélectionné',
    isp: 'FAI',
    accessPoint: 'Point d\'Accès',
    router: 'Routeur',
    switch: 'Commutateur',
    repeater: 'Répéteur',
    modem: 'Modem',
    ont: 'ONT',
    wallPhoneJack: 'Prise Téléphonique',
    bus: 'Bus',
    rj45: 'RJ45 (Ethernet)',
    rj11: 'RJ11 (Téléphone)',
    telephone: 'Câble Téléphonique',
    fiber: 'Fibre Optique',
    coaxial: 'Coaxial',
    wireless: 'Sans Fil',
    ispDescription: 'Fournisseur d\'Accès Internet: L\'entreprise qui fournit votre connexion internet',
    accessPointDescription: 'Un appareil qui crée un réseau sans fil permettant aux appareils de se connecter sans câbles',
    routerDescription: 'Connecte plusieurs réseaux et achemine le trafic réseau entre eux',
    switchDescription: 'Connecte plusieurs appareils ensemble sur le même réseau',
    repeaterDescription: 'Étend la portée d\'un réseau sans fil en amplifiant le signal',
    modemDescription: 'Convertit les données numériques de votre ordinateur en signaux analogiques pour la transmission par lignes téléphoniques/câbles',
    ontDescription: 'Terminal de Réseau Optique: Convertit les signaux de fibre optique en signaux électriques',
    wallPhoneJackDescription: 'Point de connexion pour les services téléphoniques dans les murs',
    busDescription: 'Un chemin central qui connecte plusieurs appareils ou terminaux à un seul canal de communication',
    rj45Description: 'Connecteur standard pour les câbles réseau Ethernet (cat5, cat6)',
    rj11Description: 'Connecteur plus petit utilisé pour les connexions téléphoniques et DSL',
    telephoneDescription: 'Câblage téléphonique standard utilisé pour connecter les services téléphoniques',
    fiberDescription: 'Utilise des impulsions lumineuses pour transmettre des données à haute vitesse à travers de fines fibres de verre',
    coaxialDescription: 'Câble avec un conducteur central entouré d\'isolation et d\'un blindage tressé',
    wirelessDescription: 'Ondes radio utilisées pour transmettre des données entre appareils sans câbles physiques',
  }
};

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  return { t, language };
};
