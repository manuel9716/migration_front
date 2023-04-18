export interface PotenciaOnt {
    tx: number;
    rx: number;
}

export interface IpConfigONT {
    ipONT: string;
    mask: string;
    gateway: string;
}
export interface connectedEthernetOnt {
    port: string;
    type: string;
    speed: string;
    duplex: string;
    status: string;
    statusRing: string;
}
export interface registerHistory {
    index:    string;
    upTime:   string;
    downTime: string;
    cause:    string;
}

export interface connectedToWifi {
    header: string[];
    body:   string[];
}

export interface StatusPrtg {
    city:   string;
    status: string;
}

export interface ValuesPRTG {
    jitterNat: number;
    pingInt:   number;
    pingNat:   number;
    ppInt:     number;
    ppNat:     number;
}

export interface PrtgInterface {
    status: StatusPrtg;
    values: ValuesPRTG;
}

export interface PingData {
    pSec: number;
    pSend: string;
    pLost: string;
    sizePqt: string;
    minPing: string;
    maxPing: string;
    avgPing: string;
}