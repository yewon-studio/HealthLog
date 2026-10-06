import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { parseAppData, type AppData } from './storageService';
import { todayKey } from '../utils/dateUtils';

export function backupFileName(): string {
  return `healthlog-${todayKey()}.json`;
}

export function serializeBackup(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function parseBackupText(text: string): AppData {
  try {
    return parseAppData(JSON.parse(text) as unknown);
  } catch (error) {
    if (error instanceof Error && error.message.includes('HealthLog')) {
      throw error;
    }
    throw new Error('JSON 파일을 읽지 못했습니다. HealthLog에서 내보낸 파일인지 확인해 주세요.');
  }
}

function downloadJson(filename: string, json: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function exportBackup(data: AppData): Promise<'share' | 'download'> {
  const filename = backupFileName();
  const json = serializeBackup(data);

  if (Capacitor.isNativePlatform()) {
    const written = await Filesystem.writeFile({
      path: filename,
      data: json,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    await Share.share({
      title: 'HealthLog 기록',
      url: written.uri,
      dialogTitle: '기록 파일 보내기',
    });
    return 'share';
  }

  downloadJson(filename, json);
  return 'download';
}
