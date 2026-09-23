import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../game/gameStore';
import { palette } from '../../style/palette';

interface ZoneSelectorProps {
  onSelect: (zoneIndex: number) => void;
  onCancel: () => void;
}

export function ZoneSelector({ onSelect, onCancel }: ZoneSelectorProps) {
  const { locations } = useGameStore();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Deploy to zone:</Text>
      <View style={styles.buttonRow}>
        {locations.map((loc, i) => {
          const full = loc.playerCards.length >= loc.maxCards;
          return (
            <TouchableOpacity
              key={loc.name}
              style={[styles.zoneButton, full && styles.zoneButtonFull]}
              onPress={() => !full && onSelect(i)}
              activeOpacity={full ? 1 : 0.75}
            >
              <Text style={styles.zoneName}>{loc.name}</Text>
              <Text style={styles.zoneCount}>
                {loc.playerCards.length}/{loc.maxCards}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>✕ CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'PermanentMarker_400Regular',
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  zoneButton: {
    backgroundColor: palette.playerColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignItems: 'center',
    minWidth: 72,
  },
  zoneButtonFull: {
    backgroundColor: '#555',
    borderColor: '#333',
  },
  zoneName: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 13,
    color: '#fff',
    letterSpacing: 0.5,
  },
  zoneCount: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  cancelButton: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  cancelText: {
    fontFamily: 'Bangers_400Regular',
    fontSize: 14,
    color: '#ff6666',
    letterSpacing: 1,
  },
});
