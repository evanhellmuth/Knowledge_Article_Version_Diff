# Knowledge Article Version Diff
Compare versions of a Salesforce Knowledge Article side by side.

# Requirements
Your Salesforce org must have Knowledge and Lightning Knowledge enabled.  This component will live on the Lightning Knowledge Record detail page.

# Installation
0. Install the google-diff-match-patch js diff library (https://github.com/GerHobbelt/google-diff-match-patch/tree/master/javascript) as a static resource on your org (https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/js_libs_platform.htm).

1. Copy and paste the files in this repository into your org's Development Console (package coming soon).

2. Navigate to an article detail page in the Lightning UI.

3. Click the gear icon in the upper-right and select "Edit Page" to open the flexipage builder.

4. Drag the Knowledge Article Version Diff component onto the record layout.

5. Navigate to an article detail page in Lightning once again.  Now you can choose two versions of the article using the KAV diff component.
