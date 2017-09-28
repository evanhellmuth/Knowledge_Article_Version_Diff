({
    init:function(component, event, helper){
        
    },
    
    getVersions : function(component, event, helper) {
    var action = component.get("c.getKAVs");
                
        var kavId = component.get("v.recordId");
        action.setParams({
          "knowledgeArticleVersionId" : kavId,
            "lang" : "en_US"
      });
        
        action.setCallback(this, function(data) {
            var versions = data.getReturnValue();
            component.set("v.versions", versions);
        });
        
        $A.enqueueAction(action);
  },
    launch: function(component, event, helper){
        var selectValue1 = component.find("selectKav1").get("v.value");
        var selectValue2 = component.find("selectKav2").get("v.value");
        var value = "Select Article Version";
        if(selectValue1 != value && selectValue2 != value) {
            $A.util.addClass(component.find("spinner"), "slds-show");
            helper.getFields(component);
        }
    }
})