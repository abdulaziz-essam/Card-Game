import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { PlayingCard } from '../../game/PlayingCard';
import PlayingCardWidget from '../PlayingCardWidget';
import { palette } from '../../style/palette';

interface PlayerHandProps {
  cards: PlayingCard[];
  canPlay: boolean;
  selectedCardId: string | null;
  onSelectCard: (card: PlayingCard) => void;
}

export function PlayerHand({ cards, canPlay, selectedCardId, onSelectCard }: PlayerHandProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => canPlay && onSelectCard(card)}
            activeOpacity={canPlay ? 0.8 : 1}
            style={[
              styles.cardWrapper,
              selectedCardId === card.id && styles.cardWrapperSelected,
            ]}
          >
            <PlayingCardWidget card={card} draggable={false} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 148,
    justifyContent: 'center',
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cardWrapper: {
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  cardWrapperSelected: {
    borderColor: palette.winHighlight,
    shadowColor: palette.winHighlight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
});
