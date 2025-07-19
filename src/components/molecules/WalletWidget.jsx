import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { useWallet } from "@/hooks/useWallet";
import { useLanguage } from "@/hooks/useLanguage";

const WalletWidget = () => {
  const { balance } = useWallet();
  const { t } = useLanguage();

  return (
    <Card variant="colored" className="text-center">
      <div className="flex items-center justify-center mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
          <ApperIcon name="Wallet" size={24} className="text-white" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('wallet')}</h3>
      <div className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
        ${balance.toFixed(2)}
      </div>
    </Card>
  );
};

export default WalletWidget;