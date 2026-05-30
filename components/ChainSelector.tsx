import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { CHAINS, CHAIN_GROUPS, Chain } from '../constants/chains';
import { useMultiChainStore } from '../store/multiChainStore';

interface ChainSelectorProps {
  onChainSelect?: (chainId: string) => void;
  showBalance?: boolean;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ onChainSelect, showBalance = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { activeChainId, setActiveChain, getActiveChain, balances } = useMultiChainStore();
  const activeChain = getActiveChain();

  const handleSelect = (chainId: string) => {
    setActiveChain(chainId);
    onChainSelect?.(chainId);
    setModalVisible(false);
  };

  const getChainBalance = (chainId: string) => {
    const balance = balances.find(b => b.chainId === chainId);
    return balance || { balance: 0, usdValue: 0 };
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selector}>
        <View style={styles.selectorContent}>
          <View style={[styles.chainIcon, { backgroundColor: activeChain.color + '20', borderColor: activeChain.color }]}>
            <Text style={[styles.chainIconText, { color: activeChain.color }]}>{activeChain.icon}</Text>
          </View>
          <View style={styles.chainInfo}>
            <Text style={styles.chainName}>{activeChain.name}</Text>
            {showBalance && (
              <Text style={styles.chainBalance}>
                {getChainBalance(activeChainId).balance.toFixed(4)} {activeChain.symbol}
              </Text>
            )}
          </View>
          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <Path d="M6 9l6 6 6-6" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SELECT NETWORK</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path d="M18 6L6 18M6 6l12 12" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round"/>
                </Svg>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chainList} showsVerticalScrollIndicator={false}>
              {/* EVM Chains */}
              <Text style={styles.groupLabel}>EVM COMPATIBLE</Text>
              {CHAIN_GROUPS.EVM.map(key => {
                const chain = CHAINS[key];
                const balance = getChainBalance(chain.id);
                const isActive = chain.id === activeChainId;

                return (
                  <TouchableOpacity
                    key={chain.id}
                    onPress={() => handleSelect(chain.id)}
                    style={[
                      styles.chainItem,
                      isActive && styles.chainItemActive,
                      { borderLeftColor: chain.color }
                    ]}
                  >
                    <View style={[styles.chainIcon, { backgroundColor: chain.color + '20', borderColor: chain.color }]}>
                      <Text style={[styles.chainIconText, { color: chain.color }]}>{chain.icon}</Text>
                    </View>
                    <View style={styles.chainDetails}>
                      <Text style={[styles.itemName, isActive && styles.itemNameActive]}>{chain.name}</Text>
                      <Text style={styles.itemSymbol}>{chain.symbol}</Text>
                    </View>
                    <View style={styles.chainBalanceInfo}>
                      <Text style={styles.itemBalance}>{balance.balance.toFixed(4)}</Text>
                      <Text style={styles.itemUsd}>${balance.usdValue.toFixed(2)}</Text>
                    </View>
                    {isActive && <View style={styles.activeIndicator} />}
                  </TouchableOpacity>
                );
              })}

              {/* Non-EVM Chains */}
              <Text style={[styles.groupLabel, { marginTop: 16 }]}>OTHER NETWORKS</Text>
              {CHAIN_GROUPS.NON_EVM.map(key => {
                const chain = CHAINS[key];
                const balance = getChainBalance(chain.id);
                const isActive = chain.id === activeChainId;

                return (
                  <TouchableOpacity
                    key={chain.id}
                    onPress={() => handleSelect(chain.id)}
                    style={[
                      styles.chainItem,
                      isActive && styles.chainItemActive,
                      { borderLeftColor: chain.color }
                    ]}
                  >
                    <View style={[styles.chainIcon, { backgroundColor: chain.color + '20', borderColor: chain.color }]}>
                      <Text style={[styles.chainIconText, { color: chain.color }]}>{chain.icon}</Text>
                    </View>
                    <View style={styles.chainDetails}>
                      <Text style={[styles.itemName, isActive && styles.itemNameActive]}>{chain.name}</Text>
                      <Text style={styles.itemSymbol}>{chain.symbol}</Text>
                    </View>
                    <View style={styles.chainBalanceInfo}>
                      <Text style={styles.itemBalance}>{balance.balance.toFixed(4)}</Text>
                      <Text style={styles.itemUsd}>${balance.usdValue.toFixed(2)}</Text>
                    </View>
                    {isActive && <View style={styles.activeIndicator} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 8,
    padding: 12,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chainIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chainIconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  chainInfo: {
    flex: 1,
  },
  chainName: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  chainBalance: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  modalTitle: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.greenPrimary,
    textTransform: 'uppercase',
  },
  chainList: {
    padding: 16,
  },
  groupLabel: {
    fontFamily: 'System',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textDim,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  chainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.bgPrimary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderLeftWidth: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  chainItemActive: {
    backgroundColor: Colors.bgElevated,
    borderColor: Colors.greenPrimary,
  },
  chainDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  itemNameActive: {
    color: Colors.greenPrimary,
  },
  itemSymbol: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textDim,
    marginTop: 2,
  },
  chainBalanceInfo: {
    alignItems: 'flex-end',
  },
  itemBalance: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  itemUsd: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.greenPrimary,
    shadowColor: Colors.greenPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
