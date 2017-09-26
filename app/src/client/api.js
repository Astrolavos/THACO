/* eslint max-len:0 */

import { get } from './apiMethods';

// ****** Treemap ENDPOINT *******
export function getTreemap(data) {
  return get(`/item/${data.id}`);
}

// ****** Links ENDPOINT *******
export function getLinks() {
  return get('/links');
}

// ****** All domains ENDPOINT *******
export function getDomains(data) {
  return get(`/domains/${data.day}/${data.ip}?search=${data.search || ''}&offset=${data.offset || 0}&limit=${data.limit || 30}`);
}

// ****** Blacklisted domains ENDPOINT *******
export function getBlacklistedDomains(data) {
  return get(`/blacklisted_domains/${data.day}/${data.ip}?search=${data.search || ''}&offset=${data.offset || 0}&limit=${data.limit || 30}`);
}

// ****** New domains ENDPOINT *******
export function getNewDomains(data) {
  return get(`/new_domains/${data.day}/${data.ip}?search=${data.search || ''}&offset=${data.offset || 0}&limit=${data.limit || 30}`);
}

// ****** IP info ENDPOINT *******
export function getInfo(data) {
  return get(`/info/${data.day}/${data.ip}?search=${data.search || ''}`);
}

// ****** IP REPORT ENDPOINT *******
export function getIpReport(data) {
  return get(`/ip_report/${data.ip}`);
}

// **** ThreatCrowd API *************
export function getResolutions(data) {
  return get(`/resolutions/${data.ip}`);
}

// **** ThreatMiner API *************
export function getDomainReport(data) {
  return get(`/domain_report/${data.domain}`);
}

// ****** All IPs ENDPOINT *******
export function getIPs(data) {
  return get(`/ips/${data.day}/${data.domain}?search=${data.search || ''}&offset=${data.offset || 0}&limit=${data.limit || 30}`);
  //return get(`/ips/${data.day}/${data.domain}&offset=${data.offset || 0}&limit=${data.limit || 30}`);

}




