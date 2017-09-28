({
   diff_inlineMode: function(text1, text2) {
      var dmp = new diff_match_patch();
      var diffs = dmp.diff_main(text1, text2);
      return diffs;
},
    formatLeftDiv: function(diffs) {
    var html = [];
    var pattern_amp = /&/g;
    var pattern_lt = /</g;
    var pattern_gt = />/g;
    var pattern_para = /\n/g;
    for (var x = 0; x < diffs.length; x++) {
      var op = diffs[x][0];    // Operation (insert, delete, equal)
      var data = diffs[x][1];  // Text of change.
      var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
          .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
      switch (op) {
        case DIFF_DELETE:
          html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
          break;
        case DIFF_EQUAL:
          html[x] = '<span>' + text + '</span>';
          break;
      }
    }
    return html.join('');
  },

formatRightDiv: function(diffs) {
    var html = [];
    var pattern_amp = /&/g;
    var pattern_lt = /</g;
    var pattern_gt = />/g;
    var pattern_para = /\n/g;
    for (var x = 0; x < diffs.length; x++) {
      var op = diffs[x][0];    // Operation (insert, delete, equal)
      var data = diffs[x][1];  // Text of change.
      var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
          .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
      switch (op) {
        case DIFF_INSERT:
         html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
         break;
        case DIFF_EQUAL:
          html[x] = '<span>' + text + '</span>';
          break;
      }
    }
    return html.join('');
  },
     getFields : function(component, event, helper) {
        var kavId1 = component.find("selectKav1").get("v.value");
        var kavId2 = component.find("selectKav2").get("v.value");
        var action = component.get("c.getFields");
        action.setParams({
          "knowledgeArticleVersionId1" : kavId1,
            "knowledgeArticleVersionId2" : kavId2
      });
        
        action.setCallback(this, function(data) {
            // The kavs variable holds an array of two objects.
            // Each object represents a KAV.
            // The names of the object's attributes correspond to field names on a KAV.
            // The values of the object's attributes correspond to field contents on a KAV.
            var kavs = data.getReturnValue();
            this.computeDiff(kavs, component);

            // Example: get the first KAV and iterate over all of its fields, pushing the results
            // to an array then assigning the value of this array to a component attribute named
            // "display"
            /*
             * var kav1 = kavs[0];
             * var pairs = [];
             * for (var key in kav1) {
             *     if (kav1.hasOwnProperty(key)) {
             *         pairs.push(key + ": " + kav1[key] + "\n");
             *     }
             * }
             * cmp.set("v.display", pairs);
            */

        });

        $A.enqueueAction(action);
    },
    computeDiff: function(kavs, component) {
        var kav1 = kavs[0];
        var kav2 = kavs[1];
        
        var output = "";
        
        // we assume kav1 and kav2 have the same keys
        // keys correspond to field names
        // since kav1 and kav2 come from the same KA (i.e. same article type), they should have the
        // same fields
        for (var key in kav1) {
            if (this.isImmutableField(key)) {
                continue;
            }
            // put Title and custom fields first, since this is what the user cares about
            if (!this.isTitleOrUrlNameOrCustomField(key)) {
                continue;
            }
            
            var fieldContentsKav1 = kav1[key];
            var fieldContentsKav2 = kav2[key];
            
            var leftDivString = "<div class=\"left\">";
            var middleDivString = "<div class=\"middle\">";
            var rightDivString = "<div class=\"right\">";
            
            var diff = this.diff_inlineMode(fieldContentsKav1 || "", fieldContentsKav2 || ""); 
            var formattedLeftDiv = this.formatLeftDiv(diff);
            var formatRightDiv = this.formatRightDiv(diff);
            
                output += "<div>";
                leftDivString += "<br/><h1><b>" + key + "</b></h1>";
                middleDivString += "<br/>";
                rightDivString += "<br/>";
    
                middleDivString += formattedLeftDiv;
                rightDivString += formatRightDiv;
                
                middleDivString += "<br/>";
                rightDivString += "<br/>";
                
                leftDivString += "</div>";
                middleDivString += "</div>";
                rightDivString += "</div>";
                
                output += leftDivString + middleDivString + rightDivString;
                
                output +="</div>";
            
        }
        
        for (var key in kav1) {
            if (this.isImmutableField(key)) {
                continue;
            }
            // put standard fields last, since customer is less likely to care about them
            if (this.isTitleOrUrlNameOrCustomField(key)) {
                continue;
            }
            
            var fieldContentsKav1 = kav1[key];
            var fieldContentsKav2 = kav2[key];
            
            var leftDivString = "<div class=\"left\">";
            var middleDivString = "<div class=\"middle\">";
            var rightDivString = "<div class=\"right\">";
            
            var diff = this.diff_inlineMode(fieldContentsKav1 || "", fieldContentsKav2 || ""); 
            var formattedLeftDiv = this.formatLeftDiv(diff);
            var formatRightDiv = this.formatRightDiv(diff);

                output += "<div>";
                leftDivString += "<br/><h1><b>" + key + "</b></h1>";
                middleDivString += "<br/>";
                rightDivString += "<br/>";
               
                middleDivString += formattedLeftDiv;
                rightDivString += formatRightDiv;
                
                middleDivString += "<br/>";
                rightDivString += "<br/>";
                
                leftDivString += "</div>";
                middleDivString += "</div>";
                rightDivString += "</div>";
                
                output += leftDivString + middleDivString + rightDivString;
                
                output +="</div>";
            
        }
        //var diffs = this.diff_inlineMode(text1, text2);
        
        //var leftdiv = document.getElementById("leftdiv");
        //var rightdiv = document.getElementById("rightdiv");
        $A.util.removeClass(component.find("spinner"), "slds-show");
        component.set("v.output", output);

    },
    
    isTitleOrUrlNameOrCustomField: function(str) {
        var standardFields = [
            'Archived By ID',
            'Archived Date',
            'Article Archived By ID',
            'Article Archived Date',
            'Article Case Association Count',
            'Article Created By ID',
            'Article Created Date',
            'Article Master Language',
            'Article Number',
            'Article Total View Count',
            'Created By ID',
            'Created Date',
            'First Published Date',
            'Is Deleted',
            'Is Latest Version',
            'Visible In Internal App',
            'Visible to Customer',
            'Visible to Partner',
            'Visible In Public Knowledge Base',
            'Knowledge Article ID',
            'Knowledge Article Version ID',
            'Language',
            'Last Modified By ID',
            'Last Modified Date',
            'Last Published Date',
            'Owner',
            'Publication Status',
            'Source',
            'Summary',
            'System Modstamp',
            'User ID',
            'Version Number'
            ];
        
        if (standardFields.indexOf(str) >= 0) {
            return false;
        }
        else {
            return true;
        }
    },
    
    isImmutableField: function(str) {
        var immutableFields = ['Language', 'Knowledge Article Version ID', 'System Modstamp', 'Is Deleted'];
        
        if (immutableFields.indexOf(str) >= 0) {
            return true;
        }
        else {
            return false;
        }
    }
    
})