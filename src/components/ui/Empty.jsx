import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { useLanguage } from "@/hooks/useLanguage";

const Empty = ({ 
  icon = "Inbox", 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  const { t } = useLanguage();

  return (
    <Card className="text-center py-12">
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {title || t('noDataFound')}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description || t('noDataDescription')}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel || t('getStarted')}
        </Button>
      )}
    </Card>
  );
};

export default Empty;