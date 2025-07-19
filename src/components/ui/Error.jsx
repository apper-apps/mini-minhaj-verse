import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { useLanguage } from "@/hooks/useLanguage";

const Error = ({ message, onRetry }) => {
  const { t } = useLanguage();

  return (
    <Card className="text-center py-12">
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('errorOccurred')}</h3>
      <p className="text-gray-600 mb-6">{message || t('tryAgainLater')}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          {t('tryAgain')}
        </Button>
      )}
    </Card>
  );
};

export default Error;